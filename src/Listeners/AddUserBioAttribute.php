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

use Flarum\Api\Event\Serializing;
use Flarum\Api\Serializer\UserSerializer;
use Illuminate\Contracts\Events\Dispatcher;

class AddUserBioAttribute
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(Serializing::class, [$this, 'serializing']);
    }

    /**
     * @param Serializing $event
     */
    public function serializing(Serializing $event)
    {
        if ($event->isSerializer(UserSerializer::class)) {
            $event->attributes['bio'] = $event->model->bio;
        }
    }
}
