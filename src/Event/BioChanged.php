<?php

/*
 * This file is part of dcorlette13\Flarum-UserInfo.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace dcorlette13\Flarum-UserInfo\Event;

use Flarum\User\User;

class BioChanged
{
    public function __construct(public User $user, public ?User $actor = null)
    {
    }
}
