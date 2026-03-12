<?php

if (!defined('API_ENTRY')) {
    http_response_code(404);
    exit();
}

class Auth
{

    /**
     * Ensures the current user is authenticated.
     *
     * If the user is not authenticated, sends a 401 Unauthorized
     * HTTP response and immediately terminates execution.
     *
     * Usage:
     *   Auth::requireAuth();
     *
     * This is typically used at the start of scripts or API endpoints
     * to protect resources from unauthenticated access.
     */
    public static function requireAuth()
    {

        $username = self::username();
        if ($username == null) {
            throw new UnauthenticatedError("You are not logged in");
        }

        $row = Database::findUserByUsername($username);
        if($row == null) {
            throw new UnauthenticatedError("You are not logged in");
        }

        return User::fromArray($row);
    }

    public static function username()
    {
        if (!isset($_SESSION["username"])) {
            return null;
        }

        return $_SESSION["username"];
    }
}