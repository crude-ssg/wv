<?php

define('API_ENTRY', true);
require_once __DIR__ . "/../_bootstrap.php";

Request::requireMethod("POST");
$user = Auth::requireAuth();

$settings = GenSettings::fromArray(Request::json());
$estimate = VideoGenerator::estimate($settings);
Response::json($estimate);