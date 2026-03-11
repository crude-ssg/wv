<?php

enum MembershipType: int
{
    case FREE = 0;
    case PREMIUM_LIGHT = 1;
    case PREMIUM_PLUS = 2;
}

class User extends ApiData
{
    public int $id;
    public string $username;
    public string $email;
    public MembershipType $premium;
    public int $tokens;
    public int $admin;
    public string $created_at;
    public string $updated_at;
}

enum Mode: string
{
    case T2V = 'T2V';
    case I2V = 'I2V';
}

enum AspectRatio: string
{
    case R16_9 = '16:9';
    case R4_3 = '4:3';
    case R1_1 = '1:1';
    case R3_4 = '3:4';
    case R9_16 = '9:16';
}

enum Duration: string
{
    case S5 = '5s';
    case S10 = '10s';
    case S15 = '15s';
}

class GenSettings extends ApiData
{
    public Mode $mode;
    public string $prompt;
    public string $negativePrompt;
    public AspectRatio $aspectRatio;
    public Duration $duration;
}

class VideoData extends ApiData
{
    public int $id;
    public string $url;
    public string $prompt;
    public string $timestamp;
    public ?string $thumbnail = null;
}

class GenEstimate extends ApiData
{
    public int $tokens;
    public int $duration;
}