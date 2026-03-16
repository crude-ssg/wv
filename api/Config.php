<?php

$_configuration = [
    'base_api_url' => self::httpHost() . '/video-gen/api',
    'base_url' => self::httpHost() . '/video-gen',

    'storage.public_storage_url' => self::httpHost() . "/video-storage",
    'storage.real_storage_dir' => '/data/videos',
    'storage.public_storage_dir' => self::webroot_dir() . "/video-storage"
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

class Storage {
    
    public static function storeVideoPublicly(string $username, string $videoId, string $data) {   
        $realStoragePath = self::makeVideoStoragePath(Config::get('storage.real_storage_dir'), $username, $videoId);
        $stored = file_put_contents($realStoragePath['filepath'], $data);
        if($stored === false) {
            throw new InternalServerError("Failed to save video");
        }

        $publicStoragePath = self::makeVideoStoragePath(Config::get('storage.public_storage_dir'), $username, $videoId, Config::get('storage.public_storage_url'));
        
        if(!is_dir($publicStoragePath['filepath'])) {
            mkdir($publicStoragePath['filepath'], 0755, true);
        }


        // make symlink
        if(file_exists($publicStoragePath['filepath'])) {
            unlink($publicStoragePath['filepath']);
        }

        $linked = symlink($realStoragePath['filepath'], $publicStoragePath['filepath']);
        if(!$linked) {
            throw new InternalServerError("Failed to create symlink");
        }
        
        // NOTE: technically we kinda guessing this based on what we know makeVideoStoragePath does and what we know about the web server config
        
        return [
            'filepath' => $realStoragePath['filepath'],
            'public_filepath' => $publicStoragePath['filepath'],
            'url' => $publicStoragePath['url']
        ];
    }

    /**
     * Internal helper function to make video storage path. must generate same path for both real and public storage ($baseDir)
     */
    private static function makeVideoStoragePath(string $baseDir, string $username, string $videoId, ?string $baseUrl = null) {
        $storage_dir =  $baseDir;
        $storage_dir = Util::joinPaths($storage_dir, $username);
        $filename = $videoId . ".mp4";
        $filepath = Util::joinPaths($storage_dir, $filename);

        if(!is_dir($storage_dir)) {
            mkdir($storage_dir, 0755, true);
        }

        return [
            'filepath' => $filepath,
            'filename' => $filename,
            'url' => $baseUrl ? $baseUrl . "/" . $username . "/" . $filename : null
        ];
    }
}