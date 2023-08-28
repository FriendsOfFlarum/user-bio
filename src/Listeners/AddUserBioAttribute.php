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
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use FoF\UserBio\Formatter\UserBioFormatter;

class AddUserBioAttribute
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var UserBioFormatter
     */
    protected $formatter;

    public function __construct(SettingsRepositoryInterface $settings, UserBioFormatter $formatter)
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
        $isXML = str_starts_with($bio, '<') && str_ends_with($bio, '>');
        $allowFormatting = $this->settings->get('fof-user-bio.allowFormatting', false);

        if ($actor->can('viewBio', $user)) {
            $canEdit = $actor->can('editBio', $user);

            if ($isXML) {
                // If formatting is enabled, render the bio HTML. Otherwise pass the unparsed formatting.
                $attributes['bioHtml'] = $allowFormatting ? $this->formatter->render($bio) : null;

                if (!$allowFormatting || $canEdit) {
                    $attributes['bio'] = $this->formatter->unparse($bio);
                }
            } else {
                $attributes['bio'] = $bio;
            }

            $attributes += [
                'canViewBio' => true,
                'canEditBio' => $canEdit,
            ];
        }

        return $attributes;
    }
}
