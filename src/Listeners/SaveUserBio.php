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

use Flarum\User\Event\Saving;
use FoF\UserBio\Event\BioChanged;
use Illuminate\Support\Arr;

class SaveUserBio
{
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

            $user->bio = $attributes['bio'];

            $user->raise(new BioChanged($user));

            $user->save();
        }
    }
}
