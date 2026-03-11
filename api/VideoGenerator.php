<?php

class VideoGenerator
{

    /**
     * Returns how long the expected prompt will take to generate (in seconds)
     * 
     * @param GenSettings $settings
     * 
     */
    public static function estimate(GenSettings $settings)
    {
        $estimate = new GenEstimate();
        $estimate->duration = self::estimateDuration($settings);
        $estimate->tokens = self::estimateCost($settings);
        return $estimate;
    }

    private static function estimateCost(GenSettings $settings) {
        return 200;
    }

    private static function estimateDuration(GenSettings $settings) {
        return 60;
    }

    /**
     * Generate and return the resulting video
     * @param GenSettings $settings
     * 
     * @return VideoData
     */
    public static function generate(GenSettings $settings): VideoData
    {
        sleep(5);

        $result = new VideoData();
        $result->id = 10000;
        $result->prompt = $settings->prompt;
        $result->url = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
        $result->timestamp = (new DateTime())->getTimestamp();
        $result->thumbnail = null;
        return $result;
    }

    public static function hasPendingJob(User $user) {
        return false;
    }
}