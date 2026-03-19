<?php

define('API_ENTRY', true);
require_once __DIR__ . "/../_bootstrap.php";

Request::requireMethod("POST");
$user = Auth::requireAuth();

$settings = GenSettings::fromArray(Request::json());

if($settings->mode == Mode::T2V) {
    throw new GenerateError("Text to video is not implemented yet");
}

if(empty($settings->positivePrompt)) {
    throw new GenerateError("Prompt is required");
}

// Make sure there isn't a job pending
if (VideoGenerator::hasPendingJob($user)) {
    throw new GenerateAlreadyPendingError();
}

// Make sure recently completed or failed job was not less than 60 seconds ago
$latestVideo = VideoData::findLatestByUserId($user->id);
if($latestVideo && ($latestVideo->job_status == VideoStatus::COMPLETED || $latestVideo->job_status == VideoStatus::FAILED) && !$latestVideo->exceedsAge(60)) {
    throw new GenerateError("Please wait 60 seconds before generating another video");
}

$estimate = VideoGenerator::estimate($settings);

// Make sure user has enough tokens
if ($user->tokens - $estimate->tokens < 0) {
    throw new InsufficientTokensError();
}

$video = VideoGenerator::generate($settings, $user);
Database::deductUserTokens($user->id, $estimate->tokens);
Response::json($video);