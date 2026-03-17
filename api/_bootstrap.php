<?php

if (!defined('API_ENTRY')) {
    http_response_code(404);
    exit();
}

require_once __DIR__ . "/Util.php";
require_once __DIR__ . "/Config.php";
require_once __DIR__ . "/Logger.php";
require_once __DIR__ . "/Auth.php";
require_once __DIR__ . "/Exceptions.php";
require_once __DIR__ . "/Database.php";
require_once __DIR__ . "/Request.php";
require_once __DIR__ . "/Response.php";
require_once __DIR__ . "/ApiData.php";
require_once __DIR__ . "/Schemas.php";
require_once __DIR__ . "/VideoGenerator.php";
require_once __DIR__ . "/Workflow.php";
require_once __DIR__ . "/Http.php";
require_once __DIR__ . "/Storage.php";

ExceptionHandler::setup();

session_start([
    'read_and_close' => true
]);