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
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Validation\Factory;
use Symfony\Contracts\Translation\TranslatorInterface;

class UserBioValidator extends AbstractValidator
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    public function __construct(Factory $validator, TranslatorInterface $translator, SettingsRepositoryInterface $settings)
    {
        parent::__construct($validator, $translator);

        $this->settings = $settings;
    }

    /**
     * @return array
     */
    protected function getRules()
    {
        return [
            'bio' => [
                'string',
                'max:'.$this->settings->get('fof-user-bio.maxLength'),
            ],
        ];
    }
}
