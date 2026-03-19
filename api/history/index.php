<?php

define('API_ENTRY', true);
require_once __DIR__ . "/../_bootstrap.php";

Request::requireMethod("GET");
$user = Auth::requireAuth();

$videos = VideoData::mostRecentByUser($user->id);

// this can slow down the polling, but it's better than having stale jobs
foreach ($videos as $video) {
    if(($video->job_status == VideoStatus::PROCESSING || $video->job_status == VideoStatus::PENDING) && $video->exceedsAge()) {
        $video->job_status = VideoStatus::FAILED;
        $video->message = "Job timed out";
        VideoData::update($video);
    }
}

Response::json($videos);