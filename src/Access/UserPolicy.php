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

use Flarum\User\AbstractPolicy;
use Flarum\User\User;

class UserPolicy extends AbstractPolicy
{
    protected $model = User::class;

    public function viewBio(User $actor, User $user)
    {
        // We only let the user see its own bio if they are also allowed to edit it
        return ($actor->id === $user->id && $actor->hasPermission('fof-user-bio.editOwn'))
            || $actor->hasPermission('fof-user-bio.view');
    }

    public function editBio(User $actor, User $user)
    {
        return ($actor->id === $user->id && $actor->hasPermission('fof-user-bio.editOwn'))
            || $actor->hasPermission('fof-user-bio.editAny');
    }
}
