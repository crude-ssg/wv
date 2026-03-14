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

}