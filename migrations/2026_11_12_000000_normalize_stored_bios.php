<?php

/*
 * This file is part of fof/user-bio.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use FoF\UserBio\Formatter\FormatterServiceProvider;
use Illuminate\Contracts\Container\Container;
use Illuminate\Database\Schema\Builder;

/*
 * Normalise every stored bio to parsed formatter output.
 *
 * Before GHSA-gfwx-4xmc-5hp4, a bio saved while formatting was disabled was
 * stored as raw, unparsed text. If an admin later enabled formatting, that raw
 * value was handed to the renderer, so stored markup (an <img onerror=...>, a
 * javascript: link) executed when the profile was viewed. Re-parsing recovers
 * the plain text and escapes any markup, leaving genuine formatting intact while
 * neutralising injected payloads.
 */

return [
    'up' => function (Builder $schema) {
        // Build the formatter lazily, only once a row actually needs it. A fresh
        // `php flarum install` runs this migration with an empty bio column and
        // without `cache.filestore` bound; building the formatter eagerly there
        // would fatal even though there is nothing to normalise.
        $formatter = null;
        $builtViaFallback = false;
        $getFormatter = function () use (&$formatter, &$builtViaFallback) {
            if ($formatter === null) {
                $container = resolve(Container::class);

                // Prefer the bound formatter so third-party `Extend\Formatter`
                // callbacks apply. On `php flarum migrate` the binding exists; when
                // an admin enables the extension the migration runs before the
                // service provider is registered, so fall back to building directly.
                if ($container->bound('fof-user-bio.formatter')) {
                    $formatter = $container->make('fof-user-bio.formatter');
                } else {
                    $formatter = FormatterServiceProvider::createFormatterInstance($container);
                    $builtViaFallback = true;
                }
            }

            return $formatter;
        };

        // Recover the plain text behind a stored bio: unparse genuine formatter
        // XML, otherwise treat the value as literal text. The leading-root check
        // rules out a DOCTYPE before the root element, so DOM parsing cannot be
        // steered into entity expansion or external lookups. DOM (not SimpleXML)
        // is used because s9e already requires ext-dom.
        $recoverPlainText = function (string $value) use ($getFormatter): string {
            if (preg_match('/^<[rt][\s>]/', $value) !== 1) {
                return $value;
            }

            $previous = libxml_use_internal_errors(true);
            $isXml = (new \DOMDocument())->loadXML($value) !== false;
            libxml_clear_errors();
            libxml_use_internal_errors($previous);

            if (!$isXml) {
                return $value;
            }

            // The unparser already recovers the newline that genuine output keeps
            // beside each <br/>, so no line-break rewriting is needed here.
            return $getFormatter()->unparse($value) ?? '';
        };

        $connection = $schema->getConnection();

        $connection->table('users')
            ->whereNotNull('bio')
            ->where('bio', '!=', '')
            ->select(['id', 'bio'])
            ->orderBy('id')
            ->chunkById(200, function ($users) use ($connection, $getFormatter, $recoverPlainText) {
                foreach ($users as $user) {
                    $plain = $recoverPlainText((string) $user->bio);
                    $normalized = $plain === '' ? '' : $getFormatter()->parse($plain);

                    if ($normalized !== $user->bio) {
                        $connection->table('users')
                            ->where('id', $user->id)
                            ->update(['bio' => $normalized]);
                    }
                }
            });

        // Only the fallback formatter was built without third-party `Extend\Formatter`
        // callbacks, so only then does the cached configuration need discarding, so
        // runtime rebuilds it with them. That path runs in the enable request as the
        // web user. The bound formatter (the `php flarum migrate` path) is already
        // correct, and flushing there would needlessly rebuild the renderer cache.
        if ($builtViaFallback) {
            $formatter->flush();
        }
    },

    // Re-parsing is not reversible: the pre-migration raw values are not retained.
    'down' => function (Builder $schema) {
    },
];
