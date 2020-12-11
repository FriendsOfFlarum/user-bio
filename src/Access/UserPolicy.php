<?php

/*
 * This file is part of fof/user-bio.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FoF\UserBio\Access;

use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;

class UserPolicy extends AbstractPolicy
{
    public function viewBio(User $actor, User $user)
    {
        // We only let the user see its own bio if they are also allowed to edit it
        if (($actor->id === $user->id && $actor->hasPermission('fof-user-bio.editOwn'))
            || $actor->hasPermission('fof-user-bio.view')
        ) {
            return $this->allow();
        }

        return $this->deny();
    }

    public function editBio(User $actor, User $user)
    {
        if (($actor->id === $user->id && $actor->hasPermission('fof-user-bio.editOwn'))
            || $actor->hasPermission('fof-user-bio.editAny')) {
            return $this->allow();
        }

        return $this->deny();
    }
}
