<?php

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
