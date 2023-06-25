<?php

/*
 * This file is part of fof/user-bio.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\UserBio\Extend;

use Flarum\Extend\Formatter as FlarumFormatter;
use Flarum\Extension\Extension;
use Flarum\Foundation\ContainerUtil;
use FoF\UserBio\Formatter\FormatterServiceProvider;
use Illuminate\Contracts\Container\Container;

class Formatter extends FlarumFormatter
{
    protected $configurationCallbacks = [];
    protected $parsingCallbacks = [];
    protected $unparsingCallbacks = [];
    protected $renderingCallbacks = [];

    /**
     * {@inheritdoc}
     */
    public function configure($callback): FlarumFormatter
    {
        $this->configurationCallbacks[] = $callback;

        return $this;
    }

    /**
     * {@inheritdoc}
     */
    public function parse($callback): FlarumFormatter
    {
        $this->parsingCallbacks[] = $callback;

        return $this;
    }

    /**
     * {@inheritdoc}
     */
    public function unparse($callback): FlarumFormatter
    {
        $this->unparsingCallbacks[] = $callback;

        return $this;
    }

    /**
     * {@inheritdoc}
     */
    public function render($callback): FlarumFormatter
    {
        $this->renderingCallbacks[] = $callback;

        return $this;
    }

    public function onEnable(Container $container, Extension $extension)
    {
        FormatterServiceProvider::createFormatterInstance($container)->flush();
    }

    public function onDisable(Container $container, Extension $extension)
    {
        // do nothing
    }

    public function extend(Container $container, Extension $extension = null)
    {
        $container->extend('fof-user-bio.formatter', function ($formatter, $container) {
            foreach ($this->configurationCallbacks as $callback) {
                $formatter->addConfigurationCallback(ContainerUtil::wrapCallback($callback, $container));
            }

            foreach ($this->parsingCallbacks as $callback) {
                $formatter->addParsingCallback(ContainerUtil::wrapCallback($callback, $container));
            }

            foreach ($this->unparsingCallbacks as $callback) {
                $formatter->addUnparsingCallback(ContainerUtil::wrapCallback($callback, $container));
            }

            foreach ($this->renderingCallbacks as $callback) {
                $formatter->addRenderingCallback(ContainerUtil::wrapCallback($callback, $container));
            }

            return $formatter;
        });
    }
}
