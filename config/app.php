<?php
/**
 * Application Configuration
 */
require_once __DIR__ . '/env.php';

return [
    'env'       => env('APP_ENV', 'production'),
    'debug'     => env('APP_DEBUG', false),
    'timezone'  => env('APP_TIMEZONE', 'Asia/Manila'),
    'upload_max_size' => 5 * 1024 * 1024, // 5MB
    'session' => [
        'lifetime' => 120, // minutes
        'name'     => 'cht_session',
    ],
];
