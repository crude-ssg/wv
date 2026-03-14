<?php

define('API_ENTRY', true);
require_once __DIR__ . "/../_bootstrap.php";

Request::requireMethod("GET");
$user = Auth::requireAuth();

$video_id = Request::query('video_id');

if($video_id == null) {
    throw new ValidationError("video_id is required");
}

$video = VideoData::get($video_id);

if($video == null) {
    throw new NotFoundError("Video not found");
}

if($video->user_id != $user->id) {
    throw new UnauthorizedError("You are not authorized to view this video");
}

Response::json($video);
