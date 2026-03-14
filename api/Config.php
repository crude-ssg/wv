<?php

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
        $config = [
            'base_api_url' => self::httpHost() . '/video-gen/api',
            'base_url' => self::httpHost() . '/video-gen',
            'public_storage_url' => self::httpHost() . "/video-storage",
            'public_storage_dir' => self::webroot_dir() . "/video-storage"
        ];

        return $config[$key];
    }
}