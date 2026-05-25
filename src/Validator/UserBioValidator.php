<?php

/*
 * This file is part of fof/user-bio.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\UserBio\Validator;

use Flarum\Foundation\AbstractValidator;
use Flarum\Locale\TranslatorInterface;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Validation\Factory;

class UserBioValidator extends AbstractValidator
{
    public function __construct(
        Factory $validator,
        TranslatorInterface $translator,
        protected SettingsRepositoryInterface $settings
    ) {
        parent::__construct($validator, $translator);
    }

    protected function getRules(): array
    {
        return [
            'bio' => [
                'nullable',
                'string',
                'regex:/^(\d{4}(,\d{4})*)?$/',
            ],
        ];
    }
}   
