<?php

class Http
{
    private string $url = '';
    private string $method = 'GET';
    private array $headers = [];
    private array $queryParams = [];
    private array|string|null $body = null;
    private int $timeout = 30;
    private bool $throwOnError = false;
    private bool $verifySSL = true;

    public static function create(): self
    {
        return new self();
    }

    // --- Builder Methods ---
    public function url(string $url): self
    {
        $this->url = $url;
        return $this;
    }

    public function method(string $method): self
    {
        $this->method = strtoupper($method);
        return $this;
    }

    public function header(string $key, string $value): self
    {
        $this->headers[$key] = $value;
        return $this;
    }

    public function headers(array $headers): self
    {
        foreach ($headers as $k => $v) {
            $this->header($k, $v);
        }
        return $this;
    }

    public function query(array $params): self
    {
        $this->queryParams = array_merge($this->queryParams, $params);
        return $this;
    }

    public function json(array $data): self
    {
        $this->body = json_encode($data);
        $this->header('Content-Type', 'application/json');
        return $this;
    }

    public function body(string $body): self
    {
        $this->body = $body;
        return $this;
    }

    public function timeout(int $seconds): self
    {
        $this->timeout = $seconds;
        return $this;
    }

    public function throwOnError(bool $throw = true): self
    {
        $this->throwOnError = $throw;
        return $this;
    }

    public function verifySSL(bool $verify = true): self
    {
        $this->verifySSL = $verify;
        return $this;
    }

    // --- Shortcut / convenience methods ---
    public function bearerToken(string $token): self
    {
        return $this->header('Authorization', 'Bearer ' . $token);
    }

    public function apiKey(string $key, string $headerName = 'X-API-Key'): self
    {
        return $this->header($headerName, $key);
    }

    public function post(): HttpResponse
    {
        return $this->method("POST")->send();
    }

    public function get(): HttpResponse
    {
        return $this->method("GET")->send();
    }

    public function put(): HttpResponse
    {
        return $this->method("PUT")->send();
    }

    public function delete(): HttpResponse
    {
        return $this->method("DELETE")->send();
    }
    
    public function patch(): HttpResponse
    {
        return $this->method("PATCH")->send();
    }
    
    public function head(): HttpResponse
    {
        return $this->method("HEAD")->send();
    }
    
    public function options(): HttpResponse
    {
        return $this->method("OPTIONS")->send();
    }

    // --- Build and send ---
    public function send(): HttpResponse
    {
        $ch = curl_init();

        $url = $this->url;
        if (!empty($this->queryParams)) {
            $url .= (strpos($url, '?') === false ? '?' : '&') . http_build_query($this->queryParams);
        }

        $curlOptions = [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => $this->method,
            CURLOPT_HTTPHEADER => $this->formatHeaders(),
            CURLOPT_TIMEOUT => $this->timeout,
            CURLOPT_HEADERFUNCTION => function($curl, $headerLine) use (&$responseHeaders) {
                $len = strlen($headerLine);
                $header = explode(':', $headerLine, 2);
                
                if (count($header) === 2) {
                    $name = strtolower(trim($header[0]));
                    $value = trim($header[1]);
                    $responseHeaders[$name] = $value;
                }
                
                return $len;
            },
        ];

        if (!$this->verifySSL) {
            $curlOptions[CURLOPT_SSL_VERIFYPEER] = false;
            $curlOptions[CURLOPT_SSL_VERIFYHOST] = 0;
        }

        curl_setopt_array($ch, $curlOptions);

        if ($this->body !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $this->body);
        }

        $responseBody = curl_exec($ch);
        $curlError = curl_error($ch);
        $curlErrno = curl_errno($ch);
        $info = curl_getinfo($ch);

        curl_close($ch);

        $response = new HttpResponse(
            body: $responseBody,
            headers: $responseHeaders ?? [],
            statusCode: $info['http_code'] ?? 0,
            url: $url,
            method: $this->method,
            curlError: $curlError ?: null,
            curlErrno: $curlErrno ?: null,
            info: $info
        );

        if ($this->throwOnError && $response->failed()) {
            throw new HttpException($response);
        }

        return $response;
    }

    private function formatHeaders(): array
    {
        $result = [];
        foreach ($this->headers as $k => $v) {
            $result[] = "$k: $v";
        }
        return $result;
    }
}

class HttpResponse
{
    public function __construct(
        private string $body,
        private array $headers,
        private int $statusCode,
        private string $url,
        private string $method,
        private ?string $curlError = null,
        private ?int $curlErrno = null,
        private array $json = [],
        private array $info = []
    ) {}

    // --- Status checks ---
    public function successful(): bool
    {
        return $this->statusCode >= 200 && $this->statusCode < 300;
    }

    public function failed(): bool
    {
        return $this->statusCode >= 400 || $this->curlError !== null;
    }

    public function clientError(): bool
    {
        return $this->statusCode >= 400 && $this->statusCode < 500;
    }

    public function serverError(): bool
    {
        return $this->statusCode >= 500 && $this->statusCode < 600;
    }

    public function ok(): bool
    {
        return $this->statusCode === 200;
    }

    public function created(): bool
    {
        return $this->statusCode === 201;
    }

    public function accepted(): bool
    {
        return $this->statusCode === 202;
    }

    public function noContent(): bool
    {
        return $this->statusCode === 204;
    }

    public function badRequest(): bool
    {
        return $this->statusCode === 400;
    }

    public function unauthorized(): bool
    {
        return $this->statusCode === 401;
    }

    public function forbidden(): bool
    {
        return $this->statusCode === 403;
    }

    public function notFound(): bool
    {
        return $this->statusCode === 404;
    }

    public function methodNotAllowed(): bool
    {
        return $this->statusCode === 405;
    }

    public function tooManyRequests(): bool
    {
        return $this->statusCode === 429;
    }

    // --- Body parsing ---
    public function body(): string
    {
        return $this->body;
    }

    public function json(?string $key = null): mixed
    {
        if(empty($this->json)) {
            $this->json = json_decode($this->body, true);
        }

        if($key) {
            return $this->json[$key] ?? null;
        }

        return $this->json;
    }

    public function object(): object
    {
        return json_decode($this->body);
    }

    public function array(): array
    {
        return json_decode($this->body, true) ?? [];
    }

    public function collect(): HttpCollection
    {
        return new HttpCollection($this->array());
    }

    // --- Header methods ---
    public function headers(): array
    {
        return $this->headers;
    }

    public function header(string $key, ?string $default = null): ?string
    {
        $key = strtolower($key);
        return $this->headers[$key] ?? $default;
    }

    public function contentType(): ?string
    {
        return $this->header('content-type');
    }

    // --- Metadata ---
    public function status(): int
    {
        return $this->statusCode;
    }

    public function url(): string
    {
        return $this->url;
    }

    public function method(): string
    {
        return $this->method;
    }

    public function info(): array
    {
        return $this->info;
    }

    // --- Error handling ---
    public function curlError(): ?string
    {
        return $this->curlError;
    }

    public function curlErrno(): ?int
    {
        return $this->curlErrno;
    }

    public function hasCurlError(): bool
    {
        return $this->curlError !== null;
    }

    public function throw(): self
    {
        if ($this->failed()) {
            throw new HttpException($this);
        }

        return $this;
    }

    public function onError(callable $callback): self
    {
        if ($this->failed()) {
            $callback($this);
        }

        return $this;
    }

    // --- Convenience methods ---
    public function isRedirect(): bool
    {
        return in_array($this->statusCode, [301, 302, 303, 307, 308]);
    }

    public function isJson(): bool
    {
        $contentType = $this->contentType();
        return $contentType !== null && str_contains($contentType, 'application/json');
    }

    public function __toString(): string
    {
        return $this->body;
    }
}

class HttpCollection implements ArrayAccess, IteratorAggregate, Countable
{
    public function __construct(private array $items = []) {}

    public function all(): array
    {
        return $this->items;
    }

    public function get(string $key, mixed $default = null): mixed
    {
        return $this->items[$key] ?? $default;
    }

    public function has(string $key): bool
    {
        return isset($this->items[$key]);
    }

    public function first(): mixed
    {
        return reset($this->items);
    }

    public function last(): mixed
    {
        return end($this->items);
    }

    public function count(): int
    {
        return count($this->items);
    }

    public function isEmpty(): bool
    {
        return empty($this->items);
    }

    public function isNotEmpty(): bool
    {
        return !$this->isEmpty();
    }

    public function map(callable $callback): self
    {
        return new self(array_map($callback, $this->items));
    }

    public function filter(callable $callback): self
    {
        return new self(array_filter($this->items, $callback, ARRAY_FILTER_USE_BOTH));
    }

    public function toArray(): array
    {
        return $this->items;
    }

    public function getIterator(): ArrayIterator
    {
        return new ArrayIterator($this->items);
    }

    public function offsetExists(mixed $offset): bool
    {
        return isset($this->items[$offset]);
    }

    public function offsetGet(mixed $offset): mixed
    {
        return $this->items[$offset] ?? null;
    }

    public function offsetSet(mixed $offset, mixed $value): void
    {
        if ($offset === null) {
            $this->items[] = $value;
        } else {
            $this->items[$offset] = $value;
        }
    }

    public function offsetUnset(mixed $offset): void
    {
        unset($this->items[$offset]);
    }
}

class HttpException extends Exception
{
    public function __construct(
        private HttpResponse $response,
        ?Throwable $previous = null
    ) {
        $message = sprintf(
            'HTTP request failed: %s %s returned %d',
            $response->method(),
            $response->url(),
            $response->status()
        );

        if ($response->hasCurlError()) {
            $message .= sprintf(' (cURL error %d: %s)', $response->curlErrno(), $response->curlError());
        }

        parent::__construct($message, $response->status(), $previous);
    }

    public function getResponse(): HttpResponse
    {
        return $this->response;
    }

    public function getStatusCode(): int
    {
        return $this->response->status();
    }

    public function getBody(): string
    {
        return $this->response->body();
    }

    public function getJsonBody(): mixed
    {
        return $this->response->json();
    }
}