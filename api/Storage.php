<?php


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