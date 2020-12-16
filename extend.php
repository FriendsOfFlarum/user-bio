<?php

/*
 * This file is part of fof/user-bio.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FoF\UserBio;

use Flarum\Api\Serializer\UserSerializer;
use Flarum\Extend;
use Flarum\User\Event\Saving;
use Flarum\User\User;
use FoF\UserBio\Listeners\AddUserBioAttribute;
use FoF\UserBio\Listeners\SaveUserBio;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    new Extend\Locales(__DIR__.'/resources/locale'),

    (new Extend\Event())
        ->listen(Saving::class, SaveUserBio::class),

    (new Extend\ApiSerializer(UserSerializer::class))
        ->mutate(AddUserBioAttribute::class),

    (new Extend\Policy())
        ->modelPolicy(User::class, Access\UserPolicy::class),
];
