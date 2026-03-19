<?php

$_configuration = [
    'base_api_url' => Config::httpHost() . '/video-gen/api',
    'base_url' => Config::httpHost() . '/video-gen',

    'storage.public_storage_url' => Config::httpHost() . "/video-storage",
    'storage.real_storage_dir' => '/data/videos',
    'storage.public_storage_dir' => Config::webroot_dir() . "/video-storage",

    'gen.stale_job_threshold_hours' => 3, // How long a job is considered "pending" before it's considered stale
    'gen.cost.I2V.5s' => 50,
    'gen.cost.I2V.10s' => 60,
    'gen.cost.I2V.15s' => 80,
    'gen.cost.I2V.20s' => 100,

    'instances' => [
        GpuInstance::create()
            ->baseUrl('http://72.134.81.13:40894')
            ->bearerToken('8770146493c08cfbb5ff0e737d69e45f5b88e2bf55c15ef2d42c3d60fe749e90'),
    ],
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
    
    public static function getRandomGpuInstance(): GpuInstance {
        $instances = self::get('instances');
        return $instances[array_rand($instances)];
    }
}