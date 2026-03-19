<?php

/**
 * Simple named wrapper around Http. will be expanded to include ability to track jobs, health, etc.
 */
class GpuInstance extends Http {
    public static function create(): static {
        return new static();
    }
}