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
use Flarum\Gdpr\Models\ErasureRequest;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;

class GdprIntegrationTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('flarum-gdpr');
        $this->extension('fof-user-bio');

        $this->prepareDatabase([
            'users' => [
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
            ],
            'gdpr_erasure' => [
                ['id' => 1, 'user_id' => 3, 'verification_token' => '123abc', 'status' => 'user_confirmed', 'reason' => 'I also want to be forgotten', 'created_at' => Carbon::now(), 'user_confirmed_at' => Carbon::now()],
            ],
        ]);
    }

    /**
     * @test
     */
    public function user_bio_is_anonimized()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/user-erasure-requests/1', [
                'authenticatedAs' => 1,
                'json'            => [
                    'data' => [
                        'attributes' => [
                            'processor_comment' => 'I have processed this request',
                            'meta'              => [
                                'mode' => ErasureRequest::MODE_ANONYMIZATION,
                            ],
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $user = User::find(3);
        $this->assertNotNull($user);
        $this->assertEquals('Anonymous1', $user->username);
        $this->assertNull($user->bio);
    }
}
