<?php

/*
 * This file is part of fof/user-bio.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\UserBio\Listeners;

use Flarum\Formatter\Formatter;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Event\Saving;
use FoF\UserBio\Event\BioChanged;
use FoF\UserBio\Validators\UserBioValidator;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class SaveUserBio
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var Formatter
     */
    protected $formatter;

    /**
     * @var UserBioValidator
     */
    protected $validator;

    public function __construct(SettingsRepositoryInterface $settings, Formatter $formatter, UserBioValidator $validator)
    {
        $this->settings = $settings;
        $this->formatter = $formatter;
        $this->validator = $validator;
    }

    /**
     * @param Saving $event
     *
     * @throws \Flarum\User\Exception\PermissionDeniedException
     */
    public function handle(Saving $event)
    {
        $user = $event->user;
        $data = $event->data;
        $actor = $event->actor;

        $attributes = Arr::get($data, 'attributes', []);

        if (isset($attributes['bio'])) {
            $actor->assertCan('editBio', $user);

            $this->validator->assertValid(Arr::only($attributes, 'bio'));

            $user->bio = $this->formatter->parse($attributes['bio']);

            $user->raise(new BioChanged($user));

            $user->save();
        }
    }
}
