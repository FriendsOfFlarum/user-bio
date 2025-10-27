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

use Flarum\User\Event\Saving;
use FoF\UserBio\Event\BioChanged;

class SaveUserBio
{
    /**
     * @throws \Flarum\User\Exception\PermissionDeniedException
     */
    public function handle(Saving $event): void
    {
        $user = $event->user;

        // Raise the BioChanged event if bio was modified
        if ($user->isDirty('bio')) {
            $user->raise(new BioChanged($user, $event->actor));
        }
    }
}