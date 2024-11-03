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
use Flarum\Formatter\Formatter;
use Illuminate\Cache\Repository;

class UserBioFormatter extends Formatter
{
    /**
     * @var ExtensionManager
     */
    protected $extensions;

    public function __construct(Repository $repository, string $cacheDir, ExtensionManager $extensions)
    {
        parent::__construct($repository, $cacheDir);

        $this->extensions = $extensions;
    }

    /**
     * {@inheritdoc}
     */
    protected function getComponent($name)
    {
        $formatter = $this->cache->rememberForever('fof-user-bio.formatter', function () {
            return $this->getConfigurator()->finalize();
        });

        return $formatter[$name];
    }

    /**
     * {@inheritdoc}
     */
    protected function getParser($context = null)
    {
        $parser = parent::getParser($context);

        $parser->disableTag('IMG');
        $parser->disableTag('IFRAME');
        $parser->disableTag('EMBED');

        return $parser;
    }

    /**
     * {@inheritdoc}
     */
    protected function getConfigurator()
    {
        $configurator = parent::getConfigurator();

        if ($this->extensions->isEnabled('flarum-markdown')) {
            /** @phpstan-ignore-next-line */
            $configurator->Litedown;
        }

        if ($this->extensions->isEnabled('flarum-bbcode')) {
            (new \Flarum\BBCode\Configure())($configurator);
        }

        // Add target="_blank" and rel="noopener ugc" to all URL tags on the UserBioFormatter
        $dom = $configurator->tags['URL']->template->asDOM();

        foreach ($dom->getElementsByTagName('a') as $a) {
            $a->setAttribute('target', '_blank');

            $rel = $a->getAttribute('rel');
            $a->setAttribute('rel', "$rel noopener ugc");
        }

        $dom->saveChanges();

        return $configurator;
    }

    /**
     * {@inheritdoc}
     */
    public function flush()
    {
        $this->cache->forget('fof-user-bio.formatter');
    }
}
