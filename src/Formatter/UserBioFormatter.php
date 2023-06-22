<?php

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

    protected function getComponent($name)
    {
        $formatter = $this->cache->rememberForever('fof-user-bio.formatter', function () {
            return $this->getConfigurator()->finalize();
        });

        return $formatter[$name];
    }

    protected function getParser($context = null)
    {
        $parser = parent::getParser($context);

        $parser->disableTag('IMG');
        $parser->disableTag('IFRAME');
        $parser->disableTag('EMBED');

        return $parser;
    }

    protected function getConfigurator()
    {
        $configurator = parent::getConfigurator(); // TODO: Change the autogenerated stub

        // Doesn't seem to restrict relative paths from host, regardless of value
        $configurator->urlConfig->restrictHost('');

        if ($this->extensions->isEnabled('flarum-markdown')) {
            $configurator->Litedown;
        }

        if ($this->extensions->isEnabled('flarum-bbcode')) {
            (new \Flarum\BBCode\Configure)($configurator);
        }

        return $configurator;
    }
}