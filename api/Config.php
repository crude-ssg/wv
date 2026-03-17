<?php

$_configuration = [
    'base_api_url' => Config::httpHost() . '/video-gen/api',
    'base_url' => Config::httpHost() . '/video-gen',

    'storage.public_storage_url' => Config::httpHost() . "/video-storage",
    'storage.real_storage_dir' => '/data/videos',
    'storage.public_storage_dir' => Config::webroot_dir() . "/video-storage"
];

class Config {

    public static function httpHost() {
        return $_SERVER['REQUEST_SCHEME'] . '://' . self::domain();
    }

    public static function domain() {
        return $_SERVER['HTTP_HOST'];
    }

    public static function webroot_dir() {
        return '/www/wwwroot/' . self::domain();
    }

    public static function get(string $key): mixed
    {
        global $_configuration;
        return $_configuration[$key];
    }
}