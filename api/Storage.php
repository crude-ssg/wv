<?php

class Storage {

    /**
     * Ensure the public storage directory symlink exists.
     * Creates: public_storage_dir -> real_storage_dir
     */
    public static function ensurePublicStorageLink(): void {
        $real = Config::get('storage.real_storage_dir');
        $public = Config::get('storage.public_storage_dir');

        // Already correct symlink? Nothing to do
        if (is_link($public) && readlink($public) === $real) {
            return;
        }

        // Remove any existing file or symlink
        if (file_exists($public) || is_link($public)) {
            if (is_dir($public) && !is_link($public)) {
                throw new InternalServerError("Public storage path exists and is not a symlink");
            }
            unlink($public);
        }

        // Create directory-level symlink
        if (!symlink($real, $public)) {
            throw new InternalServerError("Failed to create storage symlink");
        }
    }

    /**
     * Store a video in real storage.
     * Returns file path and public URL.
     */
    public static function storeVideoPublicly(string $username, string $videoId, string $data): array {
        // Ensure parent directories exist in real storage
        $realStoragePath = self::makeVideoStoragePath(
            Config::get('storage.real_storage_dir'),
            $username,
            $videoId
        );

        $stored = file_put_contents($realStoragePath['filepath'], $data);
        if ($stored === false) {
            throw new InternalServerError("Failed to save video");
        }

        return [
            'filepath' => $realStoragePath['filepath'],
            'url' => Config::get('storage.public_storage_url') . "/" . $username . "/" . $videoId . ".mp4"
        ];
    }

    /**
     * Internal helper: compute storage path for a video file.
     */
    private static function makeVideoStoragePath(string $baseDir, string $username, string $videoId, ?string $baseUrl = null): array {
        $storageDir = Util::joinPaths($baseDir, $username);
        $filename = $videoId . ".mp4";
        $filepath = Util::joinPaths($storageDir, $filename);

        // Ensure directory exists
        if (!is_dir($storageDir)) {
            mkdir($storageDir, 0755, true);
        }

        return [
            'filepath' => $filepath,
            'filename' => $filename,
        ];
    }
}