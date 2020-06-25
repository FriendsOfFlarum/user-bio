<?php

/*
 * This file is part of fof/user-bio.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FoF\UserBio\Event;

use Flarum\User\User;

class BioChanged
{
    /**
     * @var User
     */
    public $user;

    /**
     * @var User
     */
    public $actor;

    /**
     * @param User $user
     * @param User $actor
     */
    public function __construct(User $user, User $actor = null)
    {
        $this->user = $user;
        $this->actor = $actor;
    }
}
