<?php

if (!defined('API_ENTRY')) {
    http_response_code(404);
    exit();
}

class Response
{
    /**
     * Send a JSON response and exit.
     *
     * @param array $data Data to send as JSON
     * @param int $status HTTP status code
     */
    public static function json(array | ApiData $data, int $status = 200)
    {
        if($data instanceof ApiData) {
            $data = $data->toArray();
        }
        
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit();
    }

    public static function errorJson() {

    }

    /**
     * Send an HTML response and exit.
     *
     * @param string $html HTML content to send
     * @param int $status HTTP status code
     */
    public static function html(string $html, int $status = 200)
    {
        http_response_code($status);
        header('Content-Type: text/html; charset=utf-8');
        echo $html;
        exit();
    }
}