<?php

/*
 * This file is part of fof/user-bio.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->table('users', function (Blueprint $table) use ($schema) {
            if (!$schema->hasColumn('users', 'bio')) {
                $table->text('bio')->nullable();
            }
        });
    },

    'down' => function (Builder $schema) {
        $schema->table('users', function (Blueprint $table) {
            $table->dropColumn('bio');
        });
    },
];
