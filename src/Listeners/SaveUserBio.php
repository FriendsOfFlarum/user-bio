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

use Carbon\Carbon;
use Flarum\User\AssertPermissionTrait;
use Flarum\User\Event\Saving;
use Flarum\User\Exception\PermissionDeniedException;
use Illuminate\Contracts\Events\Dispatcher;

class SaveUserBio
{
    use AssertPermissionTrait;

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(Saving::class, [$this, 'saving']);
    }

    /**
     * @param Saving $event
     *
     * @throws \Flarum\User\Exception\PermissionDeniedException
     */
    public function saving(Saving $event)
    {
        $user = $event->user;
        $data = $event->data;
        $actor = $event->actor;

        $isSelf = $actor->id === $user->id;
        $canEdit = $actor->can('edit', $user);

        $attributes = array_get($data, 'attributes', []);

        if (isset($attributes['bio'])) {
            if (!$isSelf) {
                // Make sure that the actor has the permission to modify the user
                $this->assertPermission($canEdit);
            } else {
                // Forbid the actor from changing the bio if suspended
                $suspendedUntil = $user->suspended_until;

                if ($suspendedUntil && $suspendedUntil->gt(Carbon::now())) {
                    throw new PermissionDeniedException();
                }
            }

            $user->bio = $attributes['bio'];

            $user->save();
        }
    }
}
