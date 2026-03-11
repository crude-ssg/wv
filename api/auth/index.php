<?php

define('API_ENTRY', true);
require_once __DIR__ . "/../_bootstrap.php";

if (Request::method() != "GET") {
    Response::json([], 405);
}

$user = Auth::requireAuth();
Response::json($user);