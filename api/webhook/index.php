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

$encoded_video = $webhook_payload['encoded_outputs'][0];
$videoFile = $video->id . ".mp4";

# save to public storage
$storage_dir =  Config::get('public_storage_dir');
if(!is_dir($storage_dir)) {
    mkdir($storage_dir, 0755, true);
}
$filepath = Util::joinPaths($storage_dir, $videoFile);

$parts = explode(",", $encoded_video);
$mime = $parts[0];
$data = $parts[1];
file_put_contents($filepath, base64_decode($data));

# update video
$video->job_status = VideoStatus::COMPLETED;
$video->url =  Config::get('public_storage_url') . "/" . $videoFile;
$video->filepath = $filepath;

VideoData::update($video);

# return success
Response::json([
    'status' => 'success',
]);