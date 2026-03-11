<?php // Endpoint for getting the currently authenticated user

define('API_ENTRY', true);
require_once __DIR__ . "/../bootstrap.php";

if(Request::method() != "GET") {
    Response::json([], 405);
}

Auth::requireAuth();
$username = Auth::username();
$user = Database::findUserByUsername($username);
if($user == null) {
    Response::json([
        'status' => 'error',
        'cause' => 'INVALID_STATE',
        'message' =>  'user not found'
    ]);
}

Response::json([
    'status' => 'success',
    'user' => $user,
]);