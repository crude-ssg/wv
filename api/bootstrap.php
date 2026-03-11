<?php

if (!defined('API_ENTRY')) {
    http_response_code(404);
    exit();
}

require_once __DIR__ . "/Logger.php";
require_once __DIR__ . "/Database.php";
require_once __DIR__ . "/Auth.php";
require_once __DIR__ . "/Request.php";
require_once __DIR__ . "/Response.php";

session_start([
    'read_and_close' => true
]);