<?php

define('API_ENTRY', true);
require_once __DIR__ . "/../_bootstrap.php";

Request::requireMethod("POST");
$user = Auth::requireAuth();

$settings = GenSettings::fromArray(Request::json());

$estimate = VideoGenerator::estimate($settings);

// Make sure there isn't a job pending
if (VideoGenerator::hasPendingJob($user)) {
    throw new GenerateAlreadyPendingError();
}

// Make sure user has enough tokens
if ($user->tokens - $estimate->tokens < 0) {
    throw new InsufficientTokensError();
}

$video = VideoGenerator::generate($settings, $user);
// Database::deductUserTokens($user->id, $estimate->tokens); // commented out so we don't have to keep replenishing tokens when testing
Response::json($video);