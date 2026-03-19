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
    case S20 = '20s';
}

enum VideoStatus: string {
    case PENDING = 'pending';
    case PROCESSING = 'processing';
    case COMPLETED = 'completed';
    case FAILED = 'failed';
}

class GenSettings extends ApiData
{
    public Mode $mode;
    public ?string $encodedImage;
    public string $positivePrompt;
    public string $negativePrompt;
    public AspectRatio $aspectRatio;
    public Duration $duration;

    public static function fromArray(array $data): static
    {
        if (empty($data['encodedImage']) && $data['mode'] == Mode::I2V->value) {
            $bag = new ErrorBag();
            $bag->add('encodedImage', 'Reference image is required for I2V mode');
            throw new ValidationError('Missing reference image', $bag);
        }

        return parent::fromArray($data);
    }
        
}

class VideoData extends ApiData
{
    public string $id;
    public int $user_id;
    public string $job_id;
    public ?string $message;
    public VideoStatus $job_status;
    public GenSettings $prompt;
    public string $timestamp;
    public ?string $thumbnail = null;
    public ?string $url;
    public ?string $filepath;

    public function exceedsAge(int $threshold_seconds = null): bool {
        if($threshold_seconds == null) {
            $threshold_seconds = Config::get('gen.stale_job_threshold_hours') * 60 * 60;
        }
        $now = new DateTime();
        $videoTime = new DateTime($this->timestamp);
        $diff = $now->diff($videoTime);
        return $diff->s >= $threshold_seconds;
    }

    public static function get(string $id, $include_encoded_image = false): ?VideoData {
        $sql = "SELECT * FROM video_data WHERE id = ?";
        $result = Database::query($sql, [$id]);
        if(!$result) {
            throw new InternalServerError("Something went wrong while querying for video");
        }
        $row = $result->fetch_assoc();
        if(!$row) {
            return null;
        }
        $data = self::fromArray($row);
        if(!$include_encoded_image) {
            $data->prompt->encodedImage = null;
        }
        return $data;
    }

    public static function findLatestByUserId(int $userId, $include_encoded_image = false): ?VideoData {
        $sql = "SELECT * FROM video_data WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1";
        $result = Database::query($sql, [$userId]);
        if(!$result) {
            throw new InternalServerError("Something went wrong while querying for video");
        }
        $row = $result->fetch_assoc();
        if(!$row) {
            return null;
        }
        $data = self::fromArray($row);
        if(!$include_encoded_image) {
            $data->prompt->encodedImage = null;
        }
        return $data;
    }

    /**
     * Get all videos for a user, ordered by timestamp descending
     * @param int $userId
     * @param bool $include_encoded_image
     * @return VideoData[]
     */
    public static function mostRecentByUser(int $userId, $include_encoded_image = false): array {
        $sql = "SELECT * FROM video_data WHERE user_id = ? ORDER BY timestamp DESC";
        $result = Database::query($sql, [$userId]);
        if(!$result) {
            throw new InternalServerError("Something went wrong while querying for videos");
        }
        $videos = [];
        while($row = $result->fetch_assoc()) {
            $data = self::fromArray($row);
            if(!$include_encoded_image) {
                $data->prompt->encodedImage = null;
            }
            $videos[] = $data;
        }
        return $videos;
    }

    public static function save(VideoData $videoData): void {
        $sql = "INSERT INTO video_data (id, user_id, job_id, job_status, url, filepath, prompt, timestamp, thumbnail, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        Database::query($sql, [
            $videoData->id, 
            $videoData->user_id, 
            $videoData->job_id, 
            $videoData->job_status->value, 
            $videoData->url, 
            $videoData->filepath, 
            json_encode($videoData->prompt->toArray()), 
            $videoData->timestamp, 
            $videoData->thumbnail,
            $videoData->message
        ]);
    }

    public static function update(VideoData $videoData): void {
        $sql = "UPDATE video_data SET job_status = ?, url = ?, filepath = ?, thumbnail = ?, message = ? WHERE id = ?";
        Database::query($sql, [$videoData->job_status->value, $videoData->url, $videoData->filepath, $videoData->thumbnail, $videoData->message, $videoData->id]);
    }
}

class GenEstimate extends ApiData
{
    public int $tokens;
    public int $duration;
}