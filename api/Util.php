<?php


class Util
{
    /**
     * Join multiple path segments into a single path regardless of "/leading" or "trailing/" slashes
     * @param string ...$parts
     * @return string 
     */
    public static function joinPaths(...$parts): string
    {
        return array_reduce($parts, function ($finalPath, $nextPart) {
            return $finalPath . DIRECTORY_SEPARATOR . trim($nextPart, '/\\');
        }, '');
    }

    /**
     * Decode base64 video to array with mime and data
     * @param string $base64
     * @return array
     */
    public static function decodeBase64Video(string $base64): array {
        $parts = explode(",", $base64);
        $mime = $parts[0];
        $data = $parts[1];

        return [
            'mime' => $mime,
            'data' => base64_decode($data)
        ];
    }

}