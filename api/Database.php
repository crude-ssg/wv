<?php

if (!defined('API_ENTRY')) {
    http_response_code(404);
    exit();
}

class Database
{

    private static string $host;
    private static string $username;
    private static string $password;
    private static string $database;
    private static ?mysqli $connection = null;

    private static function init()
    {
        self::$host = $_SERVER["DB_HOST"];
        self::$username = $_SERVER["DB_USERNAME"];
        self::$password = $_SERVER["DB_PASSWORD"];
        self::$database = $_SERVER["DB_DATABASE"];
    }

    public static function connect(): void
    {
        self::init();
        self::$connection = new mysqli(self::$host, self::$username, self::$password, self::$database);
        if (self::$connection->connect_error) {
            throw new Exception("Failed to connect to database");
        }
    }

    public static function disconnect(): void
    {
        self::$connection->close();
        self::$connection = null;
    }

    // Generic prepared statement query helper
    public static function query(string $query, array $params = []): mysqli_result|bool
    {
        if (self::$connection === null) {
            self::connect();
        }

        $stmt = self::$connection->prepare($query);
        if ($stmt === false) {
            throw new Exception("Failed to prepare statement: " . self::$connection->error);
        }

        if ($params) {
            // Dynamically build types string: all strings by default, adjust as needed
            $types = str_repeat('s', count($params));
            $stmt->bind_param($types, ...$params);
        }

        $stmt->execute();
        return $stmt->get_result();
    }

    public static function deductUserTokens(int $userId, int $amount): bool
    {
        if ($amount <= 0) {
            return false; // nothing to deduct
        }

        // Atomically decrement tokens, ensuring they don't go negative
        $sql = "UPDATE users 
                SET tokens = GREATEST(tokens - ?, 0) 
                WHERE id = ?";
        $stmt = self::query($sql, [$amount, $userId]);

        return $stmt && $stmt->num_rows > 0;
    }

    public static function incrementUserTokens(int $userId, int $amount): bool
    {
        if ($amount <= 0)
            return false;

        $sql = "UPDATE users SET tokens = tokens + ? WHERE id = ?";
        $stmt = self::query($sql, [$amount, $userId]);

        if (!$stmt)
            return false;

        return $stmt->num_rows > 0;
    }

    public static function findUserByUsername(string $username): ?array
    {
        $result = self::query(
            "SELECT id, username, email, tokens, admin, premium, created_at, updated_at FROM users WHERE username = ?",
            [$username]
        );

        return $result ? $result->fetch_assoc() : null;
    }

    public static function findUserByEmail(string $email): ?array
    {
        $result = self::query(
            "SELECT id, username, email, tokens, admin, premium, created_at, updated_at FROM users WHERE email = ?",
            [$email]
        );

        return $result ? $result->fetch_assoc() : null;
    }
}
