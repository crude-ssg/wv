<?php

define('API_ENTRY', true);
require_once __DIR__ . "/../_bootstrap.php";

$video_id = Request::query('video_id');

# webhook must send us the video_id
if($video_id == null) {
    throw new ValidationError("video_id is required");
}

# webhook must send a valid vido
$video = VideoData::get($video_id);
if($video == null) {
    throw new NotFoundError("Video not found");
}

# Parse json
$webhook_payload = Request::json();

# check for failure status
if(isset($webhook_payload['status']) && $webhook_payload['status'] == 'failed') {
    $video->job_status = VideoStatus::FAILED;
    VideoData::update($video);
    Response::json($video);
}

# check for encoded outputs
if(!isset($webhook_payload['encoded_outputs'][0])) {
    throw new InternalServerError("webhook did not send encoded_outputs. Did you forget to patch /opt/comfy-api-wrapper/workspers/postprocess_worker.py on the gpu instance?");
}


try {
    // NOTE: we are assuming the first output is the video based on what we know about the workflow
    $encoded_video = $webhook_payload['encoded_outputs'][0];
    $decoded = Util::decodeBase64Video($encoded_video);
    $storage_result = Storage::storeVideoPublicly("$video->user_id", $video->id, $decoded['data']);

    # update video
    $video->job_status = VideoStatus::COMPLETED;
    $video->url = $storage_result['url'];
    $video->filepath = $storage_result['filepath'];

    VideoData::update($video);

    # return success
    Response::json([
        'status' => 'success',
    ]);
} catch (InternalServerError $e) {
    $video->job_status = VideoStatus::FAILED;
    VideoData::update($video);
    throw $e; // rethrow, will be caught by the global exception handler.
}