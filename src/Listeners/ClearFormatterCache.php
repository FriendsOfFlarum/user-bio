<?php

/*
 * This file is part of dcorlette13/flarum-userinfo.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace dcorlette13\Flarum-UserInfo\Listeners;

use Flarum\Settings\Event\Saved;

class ClearFormatterCache
{
    public function handle(Saved $event): void
    {
        foreach ($event->settings as $key => $setting) {
            if ($key === 'dcorlette13-flarum-userinfo.allowFormatting') {
                resolve('dcorlette13-flarum-userinfo.formatter')->flush();

                return;
            }
        }
    }
}
