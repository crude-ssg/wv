<?php

define('API_ENTRY', true);
require_once __DIR__ . "/../_bootstrap.php";

Request::requireMethod("GET");
$user = Auth::requireAuth();

$videos = VideoData::allByUserId($user->id);

Response::json($videos);