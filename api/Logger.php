<?php

if (!defined('API_ENTRY')) {
    http_response_code(404);
    exit();
}

class Logger
{
    private string $path;

    public function log(string $message): void
    {
        file_put_contents($this->path, $message . PHP_EOL, FILE_APPEND);
    }

    public function setupErrorHandlers(): void
    {
        set_exception_handler(function ($exception) {
            $this->log('Exception: ' . $exception->getMessage());
        });
        set_error_handler(function ($errno, $errstr, $errfile, $errline) {
            $this->log('Error: ' . $errstr);
        });
    }
}