<?php

define('API_ENTRY', true);
require_once __DIR__ . "/../bootstrap.php";

Request::requireMethod("POST");
Auth::requireAuth();

$settings = GenSettings::fromArray(Request::json());

$videoData = new VideoData();
$videoData->id = 10000;
$videoData->prompt = $settings->prompt;
$videoData->url = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
$videoData->timestamp = (new DateTime())->getTimestamp();
$videoData->thumbnail = null;

sleep(30);
Response::json($videoData->toArray());