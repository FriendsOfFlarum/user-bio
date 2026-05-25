<?php

/*
 * This file is part of dcorlette13/flarum-userinfo.
 *
 * Copyright (c) dcorlette.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace dcorlette\Flarum-UserInfo;

use Flarum\Api\Resource;
use Flarum\Extend as Flarum;
use Flarum\Settings\Event\Saved;
use Flarum\User\Event\Saving;
use Flarum\User\User;

return [
    (new Flarum\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum.less'),

    (new Flarum\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    new Flarum\Locales(__DIR__.'/resources/locale'),

    (new Flarum\Model(User::class))
        ->cast('bio', 'string'),

    (new Flarum\Event())
        ->listen(Saving::class, Listeners\SaveUserBio::class)
        ->listen(Saved::class, Listeners\ClearFormatterCache::class),

    // Flarum 2.x JSON:API - declare ALL bio-related fields via ApiResource
    (new Flarum\ApiResource(Resource\UserResource::class))
        ->fields(Api\AddUserBioFields::class),

    (new Flarum\Policy())
        ->modelPolicy(User::class, Access\UserPolicy::class),

    (new Flarum\Settings())
        ->serializeToForum('dcorlette13-flarum-userinfo.maxLength', 'dcorlette13-flarum-userinfo.maxLength', 'intVal')
        ->serializeToForum('dcorlette13-flarum-userinfo.maxLines', 'dcorlette13-flarum-userinfo.maxLines', 'intVal')
        ->default('dcorlette13-flarum-userinfo.maxLength', 200)
        ->default('dcorlette13-flarum-userinfo.maxLines', 5),

    (new Flarum\ServiceProvider())
        ->register(Formatter\FormatterServiceProvider::class),

    // GDPR Integration - Flarum 2.x
    (new Flarum\Conditional())
        ->whenExtensionEnabled('flarum-gdpr', fn () => [
            (new \Flarum\Gdpr\Extend\UserData())
                ->addType(Data\UserBioData::class),
        ]),
];
