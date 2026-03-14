CREATE TABLE video_data (
    id VARCHAR(64) PRIMARY KEY,
    user_id INT NOT NULL,
    job_id VARCHAR(64) NOT NULL,
    job_status VARCHAR(32) NOT NULL,
    prompt LONGTEXT NOT NULL,
    
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    thumbnail TEXT NULL,
    url TEXT NULL,
    filepath TEXT NULL,
    
    INDEX idx_job_id (job_id),
    INDEX idx_job_status (job_status),
    INDEX idx_timestamp (timestamp),
    
    CONSTRAINT fk_video_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);