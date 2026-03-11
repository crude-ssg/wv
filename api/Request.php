<?php

if (!defined('API_ENTRY')) {
    http_response_code(404);
    exit();
}

class Request
{
    /**
     * Get HTTP method (GET, POST, etc.)
     */
    public static function method(): string
    {
        return $_SERVER['REQUEST_METHOD'] ?? 'GET';
    }

    /**
     * Get query parameters ($_GET)
     */
    public static function query(?string $key = null, $default = null)
    {
        if ($key === null)
            return $_GET ?? [];
        return $_GET[$key] ?? $default;
    }

    /**
     * Get POST parameters ($_POST)
     */
    public static function post(?string $key = null, $default = null)
    {
        if ($key === null)
            return $_POST ?? [];
        return $_POST[$key] ?? $default;
    }

    /**
     * Get raw request body
     */
    public static function body(): string
    {
        return file_get_contents('php://input');
    }

    /**
     * Get JSON-decoded body (returns null if not JSON)
     */
    public static function json(): ?array
    {
        $contentType = self::header('content-type', '');
        if (str_contains($contentType, 'application/json')) {
            return json_decode(self::body(), true);
        }
        return null;
    }

    /**
     * Get all headers as associative array
     */
    public static function headers(): array
    {
        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (str_starts_with($key, 'HTTP_')) {
                $name = strtolower(str_replace('_', '-', substr($key, 5)));
                $headers[$name] = $value;
            }
        }
        return $headers;
    }

    /**
     * Get a single header (case-insensitive)
     */
    public static function header(string $name, $default = null)
    {
        $name = strtolower($name);
        $headers = self::headers();
        return $headers[$name] ?? $default;
    }

    /**
     * Check if request is POST
     */
    public static function isPost(): bool
    {
        return strtoupper(self::method()) === 'POST';
    }

    /**
     * Check if request is GET
     */
    public static function isGet(): bool
    {
        return strtoupper(self::method()) === 'GET';
    }
}