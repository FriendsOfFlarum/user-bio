<?php

/*
 * This file is part of fof/user-bio.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\UserBio\Data;

use Flarum\Gdpr\Data\Type;
use Flarum\Gdpr\Models\ErasureRequest;
use Flarum\Http\UrlGenerator;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use Illuminate\Contracts\Filesystem\Factory;
use Symfony\Contracts\Translation\TranslatorInterface;

class UserBioData extends Type
{
    public function __construct(
        protected User $user,
        protected ?ErasureRequest $erasureRequest,
        protected Factory $filesystemFactory,
        protected SettingsRepositoryInterface $settings,
        protected UrlGenerator $url,
        protected TranslatorInterface $translator
    ) {
    }

    public static function dataType(): string
    {
        return 'user-bio';
    }

    public function export(): ?array
    {
        // No action, data included in core user export
        return null;
    }

    public function anonymize(): void
    {
        // No action, the user biography will be cleared by the core user data type
    }

    public function delete(): void
    {
        // Nothing to do, the user table row will be deleted by the core user data type
    }

    public static function exportDescription(): string
    {
        return static::staticTranslator()->trans('flarum-gdpr.lib.data.default_user_action');
    }

    public static function anonymizeDescription(): string
    {
        return static::staticTranslator()->trans('flarum-gdpr.lib.data.default_user_action');
    }

    public static function deleteDescription(): string
    {
        return static::staticTranslator()->trans('flarum-gdpr.lib.data.default_user_action');
    }

    public static function piiFields(): array
    {
        return ['bio'];
    }
}
