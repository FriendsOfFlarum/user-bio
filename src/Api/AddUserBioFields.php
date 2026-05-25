<?php

/*
 * This file is part of dcorlette13\Flarum-UserInfo.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace dcorlette13\Flarum-UserInfo\Api;

use Flarum\Api\Context;
use Flarum\Api\Schema;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use dcorlette13\Flarum-UserInfo\Formatter\UserBioFormatter;
use dcorlette13\Flarum-UserInfo\Validator\UserBioValidator;
use Illuminate\Support\Str;

class AddUserBioFields
{
    public function __construct(
        protected SettingsRepositoryInterface $settings,
        protected UserBioFormatter $formatter,
        protected UserBioValidator $validator
    ) {
    }

    public function __invoke(): array
    {
        return [
            // Bio field - writable, visible based on permission
            Schema\Str::make('bio')
                ->get(fn (User $user, Context $context) => $this->getBio($user, $context))
                ->writable(fn (User $user, Context $context) => $context->getActor()->can('editBio', $user))
                ->set(function (User $user, string $value, Context $context) {
                    // Validate only year values in a comma-separated list
                    $this->validator->assertValid(['bio' => $value]);
                    $user->bio = $value;
                })
                ->visible(fn (User $user, Context $context) => $context->getActor()->can('viewBio', $user)),

            // BioHtml field - read only, rendered HTML version
            Schema\Str::make('bioHtml')
                ->get(fn (User $user, Context $context) => $this->getBioHtml($user, $context))
                ->visible(fn (User $user, Context $context) => $context->getActor()->can('viewBio', $user)),

            // CanViewBio - permission flag
            Schema\Boolean::make('canViewBio')
                ->get(fn (User $user, Context $context) => $context->getActor()->can('viewBio', $user)),

            // CanEditBio - permission flag
            Schema\Boolean::make('canEditBio')
                ->get(fn (User $user, Context $context) => $context->getActor()->can('editBio', $user)),
        ];
    }

    protected function getBio(User $user, Context $context): ?string
    {
        if (!$context->getActor()->can('viewBio', $user)) {
            return null;
        }
        return $user->bio ?? '';
    }

    protected function getBioHtml(User $user, Context $context): ?string
    {
        // No HTML rendering needed for plain year lists
        return null;
    }
}
