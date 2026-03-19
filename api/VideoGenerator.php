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

    private static function estimateCost(GenSettings $settings)
    {
        return Config::get("gen.cost.{$settings->mode->value}.{$settings->duration->value}");
    }

    private static function estimateDuration(GenSettings $settings)
    {
        return 60;
    }

    /**
     * Generate and return the resulting video
     * @param GenSettings $settings
     * 
     * @return VideoData
     */
    public static function generate(GenSettings $settings, User $user)
    {
        $workflow = new Workflow('i2v-autoprompt-workflow-api.json');
        $workflow = $workflow->build($settings);
        
        $instance = Config::getRandomGpuInstance();
        $video_id = uniqid();
        $response = $instance
            ->url('/generate')
            ->throwOnError()
            ->timeout(600)
            ->json([
                "input" => [
                    'workflow_json' => $workflow,
                    'webhook' => [
                        'url' => Config::get('base_api_url') . "/webhook/?video_id=" . $video_id
                    ]
                ]
            ])
            ->post();
        
        if($response->failed()) {
            throw new GenerateError("Failed to generate video");
        }
        
        if($response->json('status') == 'failed') {
            throw new GenerateError("Failed to generate video", previous: new InternalServerError($response->body()));
        }

        $result = new VideoData();
        $result->id = $video_id;
        $result->user_id = $user->id;
        $result->job_id = $response->json('id');
        $result->job_status = VideoStatus::from($response->json('status'));
        $result->prompt = $settings;
        $result->url = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
        $result->timestamp = (new DateTime())->format('Y-m-d H:i:s');
        $result->filepath = null;
        $result->url = null;
        $result->message = null;
        $result->thumbnail = null;
        VideoData::save($result);

        return $result;
    }

    public static function hasPendingJob(User $user)
    {
        $video = VideoData::findLatestByUserId($user->id);
        if($video == null) {
            return false;
        }
        
        return !$video->exceedsAge() && $video->job_status != VideoStatus::COMPLETED && $video->job_status != VideoStatus::FAILED;
    }
}