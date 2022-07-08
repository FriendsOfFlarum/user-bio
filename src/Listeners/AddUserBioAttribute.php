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

use Flarum\Api\Serializer\UserSerializer;
use Flarum\Formatter\Formatter;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;

class AddUserBioAttribute
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var Formatter
     */
    protected $formatter;

    public function __construct(SettingsRepositoryInterface $settings, Formatter $formatter)
    {
        $this->settings = $settings;
        $this->formatter = $formatter;
    }

    /**
     * @param UserSerializer $serializer
     * @param User           $user
     * @param array          $attributes
     *
     * @return array
     */
    public function __invoke(UserSerializer $serializer, User $user, array $attributes): array
    {
        $actor = $serializer->getActor();

        $bio = $user->bio ?? '';
        $isXML = str_starts_with($bio, '<');

        if ($actor->can('viewBio', $user)) {
            if ($isXML) {
                $attributes['bioHtml'] = $this->formatter->render($bio);

                if ($actor->id === $user->id) {
                    $attributes['bio'] = $this->formatter->unparse($bio);
                }
            } else {
                $attributes['bio'] = $bio;
            }

            $attributes += [
                'canViewBio' => true,
                'canEditBio' => $actor->can('editBio', $user),
            ];
        }

        return $attributes;
    }
}
