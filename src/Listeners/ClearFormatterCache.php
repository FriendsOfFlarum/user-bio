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

use Flarum\Settings\Event\Saved;

class ClearFormatterCache
{
    public function handle(Saved $event)
    {
        foreach ($event->settings as $key => $setting) {
            if ($key === 'fof-user-bio.allowFormatting') {
                resolve('fof-user-bio.formatter')->flush();

                return;
            }
        }
    }
}
