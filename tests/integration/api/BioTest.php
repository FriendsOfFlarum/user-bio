<?php

/*
 * This file is part of fof/user-bio.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\UserBio\Tests\integration\api;

use Carbon\Carbon;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;
use FoF\UserBio\Formatter\UserBioFormatter;
use Illuminate\Database\ConnectionResolverInterface;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;

class BioTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    protected function setUp(): void
    {
        parent::setUp();

        $this->setting('mail_driver', 'log');

        $this->extension('fof-user-bio');

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                [
                    'id'                 => 3,
                    'username'           => 'normal2',
                    'password'           => '$2y$10$LO59tiT7uggl6Oe23o/O6.utnF6ipngYjvMvaxo1TciKqBttDNKim', // BCrypt hash for "too-obscure"
                    'email'              => 'normal2@machine.local',
                    'is_email_confirmed' => 1,
                    'last_seen_at'       => Carbon::now()->subSecond(),
                    'bio'                => 'This is a test bio for normal2.',
                ],
                [
                    'id'                 => 4,
                    'username'           => 'normal3',
                    'password'           => '$2y$10$LO59tiT7uggl6Oe23o/O6.utnF6ipngYjvMvaxo1TciKqBttDNKim', // BCrypt hash for "too-obscure"
                    'email'              => 'normal3@machine.local',
                    'is_email_confirmed' => 1,
                    'last_seen_at'       => Carbon::now()->subHour(),
                ],
                [
                    'id'                 => 5,
                    'username'           => 'moderator',
                    'password'           => '$2y$10$LO59tiT7uggl6Oe23o/O6.utnF6ipngYjvMvaxo1TciKqBttDNKim', // BCrypt hash for "too-obscure"
                    'email'              => 'moderator@machine.local',
                    'is_email_confirmed' => 1,
                    'last_seen_at'       => Carbon::now()->subHour(),
                ],
                [
                    'id'                 => 6,
                    'username'           => 'normal4',
                    'password'           => '$2y$10$LO59tiT7uggl6Oe23o/O6.utnF6ipngYjvMvaxo1TciKqBttDNKim', // BCrypt hash for "too-obscure"
                    'email'              => 'normal4@machine.local',
                    'is_email_confirmed' => 1,
                    'last_seen_at'       => Carbon::now()->subHour(),
                    'bio'                => "<t>Bio content<br/>\n123</t>", // genuine parser output
                ],
            ],
            'group_user' => [
                ['user_id' => 5, 'group_id' => 4],
            ],
            'group_permission' => [
                ['permission' => 'fof-user-bio.editOwn', 'group_id' => 4],
                ['permission' => 'fof-user-bio.view', 'group_id' => 4],
                ['permission' => 'fof-user-bio.editAny', 'group_id' => 4],
            ],
        ]);
    }

    protected function giveNormalUsersEditOwnPerms()
    {
        $this->prepareDatabase([
            'group_permission' => [
                ['permission' => 'fof-user-bio.editOwn', 'group_id' => 3],
            ],
        ]);
    }

    protected function giveNormalUserViewBioPerms()
    {
        $this->prepareDatabase([
            'group_permission' => [
                ['permission' => 'fof-user-bio.view', 'group_id' => 3],
            ],
        ]);
    }

    #[Test]
    public function admin_can_create_user_with_bio()
    {
        $response = $this->send(
            $this->request(
                'POST',
                '/api/users',
                [
                    'authenticatedAs' => 1,
                    'json'            => [
                        'data' => [
                            'attributes' => [
                                'username' => 'test',
                                'password' => 'too-obscure',
                                'email'    => 'test@machine.local',
                                'bio'      => 'This is a test bio.',
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(201, $response->getStatusCode());

        /** @var User $user */
        $user = User::where('username', 'test')->firstOrFail();

        $this->assertEquals(0, $user->is_email_confirmed);
        $this->assertEquals('test', $user->username);
        $this->assertEquals('test@machine.local', $user->email);
        $this->assertEquals('<t>This is a test bio.</t>', $user->bio);
    }

    #[Test]
    public function admin_can_create_user_with_bio_formatted()
    {
        $this->setting('fof-user-bio.allowFormatting', true);

        $response = $this->send(
            $this->request(
                'POST',
                '/api/users',
                [
                    'authenticatedAs' => 1,
                    'json'            => [
                        'data' => [
                            'attributes' => [
                                'username' => 'test2',
                                'password' => 'too-obscure',
                                'email'    => 'test2@machine.local',
                                'bio'      => 'This is a test formatted bio.',
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(201, $response->getStatusCode());

        /** @var User $user */
        $user = User::where('username', 'test2')->firstOrFail();

        $this->assertEquals(0, $user->is_email_confirmed);
        $this->assertEquals('test2', $user->username);
        $this->assertEquals('test2@machine.local', $user->email);
        $this->assertEquals('<t>This is a test formatted bio.</t>', $user->bio);
    }

    #[Test]
    public function cannot_update_own_bio_when_permission_not_granted()
    {
        $response = $this->send(
            $this->request(
                'PATCH',
                '/api/users/2',
                [
                    'authenticatedAs' => 2,
                    'json'            => [
                        'data' => [
                            'attributes' => [
                                'bio' => 'This is a test bio.',
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    #[Test]
    public function can_update_own_user_with_added_bio_when_permission_granted()
    {
        $this->giveNormalUsersEditOwnPerms();

        $response = $this->send(
            $this->request(
                'PATCH',
                '/api/users/2',
                [
                    'authenticatedAs' => 2,
                    'json'            => [
                        'data' => [
                            'attributes' => [
                                'bio' => 'This is a test bio.',
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        /** @var User $user */
        $user = User::where('id', 2)->firstOrFail();

        $this->assertEquals('<t>This is a test bio.</t>', $user->bio);
    }

    #[Test]
    #[DataProvider('formattingSettings')]
    public function saved_bio_is_trimmed_with_blank_lines_collapsed(bool $allowFormatting)
    {
        $this->setting('fof-user-bio.allowFormatting', $allowFormatting);
        $this->giveNormalUsersEditOwnPerms();

        $response = $this->send(
            $this->request(
                'PATCH',
                '/api/users/2',
                [
                    'authenticatedAs' => 2,
                    'json'            => [
                        'data' => [
                            'attributes' => [
                                'bio' => "  First line\n\n\n\n\nSecond line  ",
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertEquals("First line\n\nSecond line", $json['data']['attributes']['bio']);
    }

    public static function formattingSettings(): array
    {
        return [
            'plain text' => [false],
            'formatted'  => [true],
        ];
    }

    #[Test]
    public function normal_user_cannot_see_bio_of_other_user_without_permission()
    {
        $response = $this->send(
            $this->request(
                'GET',
                '/api/users/3',
                [
                    'authenticatedAs' => 2,
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $this->assertArrayNotHasKey('bio', json_decode($response->getBody()->getContents(), true)['data']['attributes']);
    }

    #[Test]
    public function normal_user_can_see_others_bio_with_permission()
    {
        $this->giveNormalUserViewBioPerms();

        $response = $this->send(
            $this->request(
                'GET',
                '/api/users/3',
                [
                    'authenticatedAs' => 2,
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayHasKey('bio', $data['data']['attributes']);
        $this->assertEquals('This is a test bio for normal2.', $data['data']['attributes']['bio']);
    }

    #[Test]
    public function moderator_can_edit_others_bio_when_permission_granted()
    {
        $this->giveNormalUserViewBioPerms();

        $response = $this->send(
            $this->request(
                'PATCH',
                '/api/users/3',
                [
                    'authenticatedAs' => 5,
                    'json'            => [
                        'data' => [
                            'attributes' => [
                                'bio' => 'This is a test bio - edited.',
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        /** @var User $user */
        $user = User::where('id', 3)->firstOrFail();

        $this->assertEquals('<t>This is a test bio - edited.</t>', $user->bio);
    }

    #[Test]
    public function normal_user_cannot_edit_bio_of_others_without_permission()
    {
        $response = $this->send(
            $this->request(
                'PATCH',
                '/api/users/3',
                [
                    'authenticatedAs' => 2,
                    'json'            => [
                        'data' => [
                            'attributes' => [
                                'bio' => 'This is a test bio - edited.',
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    #[Test]
    public function formatted_bio_is_returned_as_html_when_formatting_is_allowed()
    {
        // Enable formatting
        $this->setting('fof-user-bio.allowFormatting', true);

        $response = $this->send(
            $this->request(
                'GET',
                '/api/users/6',
                [
                    'authenticatedAs' => 5,
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayHasKey('bioHtml', $data['data']['attributes']);
        $this->assertStringStartsWith('Bio content', $data['data']['attributes']['bioHtml']);
        $this->assertStringContainsString('<br>', $data['data']['attributes']['bioHtml']);
    }

    #[Test]
    public function formatted_bio_is_returned_as_plain_text_when_formatting_is_not_allowed()
    {
        // Enable formatting
        $this->setting('fof-user-bio.allowFormatting', false);

        $response = $this->send(
            $this->request(
                'GET',
                '/api/users/6',
                [
                    'authenticatedAs' => 5,
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayHasKey('bioHtml', $data['data']['attributes']);
        $this->assertNull($data['data']['attributes']['bioHtml']);
        $this->assertStringStartsWith('Bio content', $data['data']['attributes']['bio']);
    }

    #[Test]
    public function plain_text_bio_is_returned_as_is()
    {
        $response = $this->send(
            $this->request(
                'GET',
                '/api/users/3',
                [
                    'authenticatedAs' => 5,
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayHasKey('bio', $data['data']['attributes']);
        $this->assertStringStartsNotWith('<', $data['data']['attributes']['bio']);
        $this->assertStringEndsNotWith('>', $data['data']['attributes']['bio']);
    }

    #[Test]
    public function response_contains_can_view_and_edit_bio_attributes()
    {
        $this->giveNormalUserViewBioPerms();

        $response = $this->send(
            $this->request(
                'GET',
                '/api/users/3',
                [
                    'authenticatedAs' => 2,
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getBody()->getContents(), true);

        $this->assertTrue($data['data']['attributes']['canViewBio']);
        $this->assertFalse($data['data']['attributes']['canEditBio']);  // Assuming user 2 cannot edit user 3's bio
    }

    /**
     * Regression test for GHSA-gfwx-4xmc-5hp4.
     *
     * A bio saved while formatting is disabled must never be rendered as HTML
     * once an admin enables formatting: the parser has to escape the raw markup
     * at save time, so the stored value can only ever render as inert text.
     */
    #[Test]
    public function bio_saved_while_formatting_disabled_is_not_rendered_as_html_when_formatting_is_later_enabled()
    {
        $this->giveNormalUsersEditOwnPerms();
        $this->giveNormalUserViewBioPerms();

        // Formatting is off; a member stores a payload crafted to look like
        // formatter output.
        $this->setting('fof-user-bio.allowFormatting', false);

        $payload = '<t><img src="x" onerror="window.xss=1"></t>';

        $this->send($this->request('PATCH', '/api/users/2', [
            'authenticatedAs' => 2,
            'json'            => ['data' => ['attributes' => ['bio' => $payload]]],
        ]));

        // The raw payload must never be stored verbatim: parsing escapes the markup.
        $stored = User::where('id', 2)->firstOrFail()->bio;
        $this->assertNotEquals($payload, $stored);
        $this->assertStringContainsString('&lt;img', $stored);

        // An admin later enables formatting. setting() only applies at boot, so
        // change the live repository to affect the request below.
        $this->app()->getContainer()->make(SettingsRepositoryInterface::class)
            ->set('fof-user-bio.allowFormatting', true);

        $response = $this->send($this->request('GET', '/api/users/2', [
            'authenticatedAs' => 1,
        ]));

        $this->assertEquals(200, $response->getStatusCode());

        $attributes = json_decode($response->getBody()->getContents(), true)['data']['attributes'];

        // The renderer must actually run (non-null) and emit inert, escaped markup:
        // the <img> is present only as escaped text, never as a live element.
        $this->assertNotNull($attributes['bioHtml']);
        $this->assertStringNotContainsString('<img', $attributes['bioHtml']);
        $this->assertStringContainsString('&lt;img', $attributes['bioHtml']);
    }

    protected function runNormaliseMigration(): void
    {
        $migration = require dirname(__DIR__, 3).'/migrations/2026_11_12_000000_normalize_stored_bios.php';
        $schema = $this->app()->getContainer()
            ->make(ConnectionResolverInterface::class)
            ->connection()
            ->getSchemaBuilder();

        ($migration['up'])($schema);
    }

    /**
     * The migration is the only thing that neutralises payloads already stored on
     * live forums, and it runs against an empty column in the normal test boot, so
     * it is exercised directly here against seeded rows.
     */
    #[Test]
    public function migration_normalises_existing_stored_bios()
    {
        /** @var UserBioFormatter $formatter */
        $formatter = $this->app()->getContainer()->make(UserBioFormatter::class);

        // A genuine rich (<r>) document must survive the migration untouched.
        $genuine = $formatter->parse('Visit https://example.com every day');
        $this->assertStringStartsWith('<r>', $genuine);

        // Seed raw values directly, bypassing the save funnel, as pre-fix rows were.
        User::where('id', 2)->update(['bio' => '<t><img src=x onerror="window.xss=1"></t>']); // malformed payload
        User::where('id', 3)->update(['bio' => '<r><URL url="javascript:alert(1)">x</URL></r>']); // well-formed forged URL
        User::where('id', 4)->update(['bio' => '<t></t>']);                                   // empty document
        User::where('id', 5)->update(['bio' => 'Plain <3 text & more']);                      // legacy raw text
        User::where('id', 6)->update(['bio' => $genuine]);                                     // genuine, must not change

        $this->runNormaliseMigration();

        // Malformed payload: escaped, renders no live element.
        $bio2 = User::find(2)->bio;
        $this->assertStringNotContainsString('<img', $bio2);
        $this->assertStringContainsString('&lt;img', $bio2);
        $this->assertStringNotContainsString('<img', $formatter->render($bio2));

        // Well-formed forged URL: the javascript: scheme does not survive re-parsing.
        $this->assertStringNotContainsString('javascript:', $formatter->render(User::find(3)->bio));

        // Empty document collapses to an empty string.
        $this->assertSame('', User::find(4)->bio);

        // Legacy raw text becomes parser output and round-trips to the same text.
        $bio5 = User::find(5)->bio;
        $this->assertStringStartsWith('<t>', $bio5);
        $this->assertSame('Plain <3 text & more', $formatter->unparse($bio5));

        // Genuine parser output is left untouched.
        $this->assertSame($genuine, User::find(6)->bio);

        // Idempotent: a second run changes nothing.
        $before = User::whereNotNull('bio')->pluck('bio', 'id')->all();
        $this->runNormaliseMigration();
        $this->assertSame($before, User::whereNotNull('bio')->pluck('bio', 'id')->all());
    }
}
