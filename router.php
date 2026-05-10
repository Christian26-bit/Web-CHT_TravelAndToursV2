<?php
// router.php - For PHP built-in development server only
// Usage: php -S localhost:8000 router.php

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Serve existing static files directly (CSS, JS, images, etc.)
if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false; // Let the built-in server handle static files
}

// Route everything else through index.php
require __DIR__ . '/index.php';
