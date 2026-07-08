<?php

/*
 * This file is part of fof/user-bio.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\UserBio\Tests\integration;

use Flarum\Audit\AuditLog;
use Flarum\Audit\AuditLogger;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;
use PHPUnit\Framework\Attributes\Test;

class AuditTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    protected function setUp(): void
    {
        parent::setUp();

        // Lifecycle events fired outside the test transaction shouldn't create stray entries.
        AuditLogger::$testMode = true;

        $this->extension('flarum-audit', 'fof-user-bio');

        $this->prepareDatabase([
            'audit_log' => [],
            User::class => [
                [
                    'id'       => 3,
                    'username' => 'user3',
                    'email'    => 'user3@example.com',
                ],
            ],
        ]);
    }

    #[Test]
    public function update()
    {
        $response = $this->send($this->request('PATCH', '/api/users/3', [
            'authenticatedAs' => 1,
            'json'            => [
                'data' => [
                    'attributes' => [
                        'bio' => 'Hello World',
                    ],
                ],
            ],
        ]));

        $this->assertEquals(200, $response->getStatusCode(), $response->getBody()->getContents());

        $log = AuditLog::query()->where('action', 'user.bio_changed')->first();
        $this->assertNotNull($log);
        $this->assertEquals(1, $log->actor_id);
        $this->assertEquals(['user_id' => 3], $log->payload);
        $this->assertEquals('127.0.0.1', $log->ip_address);
    }
}
