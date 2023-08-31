<?php

/*
 * This file is part of fof/user-bio.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\UserBio;

use Flarum\Api\Serializer\UserSerializer;
use Flarum\Extend as Flarum;
use Flarum\Settings\Event\Saved;
use Flarum\User\Event\Saving;
use Flarum\User\User;
use s9e\TextFormatter\Configurator;

return [
    (new Flarum\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum.less'),

    (new Flarum\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    new Flarum\Locales(__DIR__.'/resources/locale'),

    (new Flarum\Event())
        ->listen(Saving::class, Listeners\SaveUserBio::class)
        ->listen(Saved::class, Listeners\ClearFormatterCache::class),

    (new Flarum\ApiSerializer(UserSerializer::class))
        ->attributes(Listeners\AddUserBioAttribute::class),

    (new Flarum\Policy())
        ->modelPolicy(User::class, Access\UserPolicy::class),

    (new Flarum\Settings())
        ->serializeToForum('fof-user-bio.maxLength', 'fof-user-bio.maxLength', 'intVal')
        ->default('fof-user-bio.maxLength', 200),

    (new Flarum\ServiceProvider())
        ->register(Formatter\FormatterServiceProvider::class),
];
