<?php

/*
 * This file is part of fof/user-bio.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\UserBio\Formatter;

use Flarum\Extension\ExtensionManager;
use Flarum\Foundation\AbstractServiceProvider;
use Flarum\Foundation\Paths;
use Illuminate\Cache\Repository;
use Illuminate\Container\Container;

class FormatterServiceProvider extends AbstractServiceProvider
{
    public function register(): void
    {
        $this->container->singleton('fof-user-bio.formatter', function (Container $container) {
            return new UserBioFormatter(
                new Repository($container->make('cache.filestore')),
                $container[Paths::class]->storage.'/formatter',
                $container->make(ExtensionManager::class)
            );
        });

        $this->container->alias('fof-user-bio.formatter', UserBioFormatter::class);
    }
}
