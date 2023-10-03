<?php

/*
 * This file is part of fof/user-bio.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\UserBio\tests\integration\api;

use Carbon\Carbon;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;

class BioTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    protected function setUp(): void
    {
        parent::setUp();

        $this->setting('mail_driver', 'log');

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
                [
                    'id'                 => 4,
                    'username'           => 'normal3',
                    'password'           => '$2y$10$LO59tiT7uggl6Oe23o/O6.utnF6ipngYjvMvaxo1TciKqBttDNKim', // BCrypt hash for "too-obscure"
                    'email'              => 'normal3@machine.local',
                    'is_email_confirmed' => 1,
                    'last_seen_at'       => Carbon::now()->subHour(),
                ],
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

    /**
     * @test
     */
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
        $this->assertEquals('This is a test bio.', $user->bio);
    }

    /**
     * @test
     */
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

    /**
     * @test
     */
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

        $this->assertEquals('This is a test bio.', $user->bio);
    }

    /**
     * @test
     */
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

    /**
     * @test
     */
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
}
