<?php

/*
 * This file is part of fof/user-bio.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\UserBio\Gdpr;

use Flarum\Gdpr\Contracts\DataType;
use Flarum\Gdpr\Models\ErasureRequest;
use Flarum\Http\UrlGenerator;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use Illuminate\Contracts\Filesystem\Factory;
use Symfony\Contracts\Translation\TranslatorInterface;

class UserBioData implements DataType
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
        if (empty($this->user->bio)) {
            return null;
        }

        return [
            'user-bio/bio.json' => json_encode([
                'bio' => $this->user->bio,
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        ];
    }

    public function anonymize(): void
    {
        $this->user->bio = null;
        $this->user->save();
    }

    public function delete(): void
    {
        $this->user->bio = null;
        $this->user->save();
    }

    public static function exportDescription(): string
    {
        return 'User biography text';
    }

    public static function anonymizeDescription(): string
    {
        return 'Remove user biography';
    }

    public static function deleteDescription(): string
    {
        return 'Remove user biography';
    }
}