<?php

abstract class ApiError extends Exception
{
    protected int $status = 500;

    public function getStatus(): int
    {
        return $this->status;
    }

    public function toArray(): array
    {
        return [
            "error" => [
                "type" => (new ReflectionClass($this))->getShortName(),
                "message" => $this->getMessage(),
                "code" => $this->getCode(),
            ]
        ];
    }
}

class NotFoundError extends ApiError
{
    protected int $status = 404;
}

class ValidationError extends ApiError
{
    protected int $status = 400;
}

class UnauthenticatedError extends ApiError
{
    protected int $status = 401;
}

class MethodNotAllowedError extends ApiError
{
    protected int $status = 405;
}

class InternalServerError extends ApiError
{
    protected int $status = 500;

    public function toArray(): array
    {
        $response = parent::toArray();
        if ($this->getPrevious()) {
            $response["error"]["trace"] = $this->getPrevious()->getTrace();
            $response["error"]["line"] = $this->getPrevious()->getLine();
            $response["error"]["file"] = $this->getPrevious()->getFile();
            $response["error"]["code"] = $this->getPrevious()->getCode();
            $response["error"]["msg"] = $this->getPrevious()->getMessage();
        }
        return $response;
    }
}

class ExceptionHandler
{
    public static function setup()
    {
        set_exception_handler([self::class, "handleException"]);
        set_error_handler([self::class, 'handleError']);
    }

    public static function handleException(Throwable $e)
    {
        if ($e instanceof ApiError) {
            Response::json($e->toArray(), $e->getStatus());
        }

        // fallback 
        $serverError = new InternalServerError("Unexpected error", previous: $e);
        Response::json($serverError->toArray(), $serverError->getStatus());
    }

    public static function handleError(
        int $severity,
        string $message,
        string $file,
        int $line
    ): bool {
        // Convert PHP errors → exceptions
        throw new ErrorException($message, 0, $severity, $file, $line);
    }
}