<?php

/*
 * This file is part of fof/user-bio.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FoF\UserBio\Listeners;

use Flarum\Api\Serializer\UserSerializer;
use Flarum\User\User;

class AddUserBioAttribute
{
    public function __invoke(UserSerializer $serializer, User $user, array $attributes): array
    {
        $actor = $serializer->getActor();

        if ($actor->can('viewBio', $user)) {
            $attributes += [
                'bio'        => $user->bio,
                'canViewBio' => true,
                'canEditBio' => $actor->can('editBio', $user),
            ];
        }

        return $attributes;
    }
}
