<?php
/**
 * Simple .env file loader
 * Reads key=value pairs from .env and sets them as environment variables
 */
function loadEnv(string $path): void {
    if (!file_exists($path)) {
        return;
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        // Skip comments
        $line = trim($line);
        if ($line === '' || $line[0] === '#') {
            continue;
        }
        
        // Parse key=value
        if (strpos($line, '=') === false) {
            continue;
        }
        
        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        
        // Remove surrounding quotes
        if (strlen($value) >= 2 && 
            (($value[0] === '"' && $value[-1] === '"') || 
             ($value[0] === "'" && $value[-1] === "'"))) {
            $value = substr($value, 1, -1);
        }
        
        if (!array_key_exists($key, $_ENV)) {
            $_ENV[$key] = $value;
            putenv("$key=$value");
        }
    }
}

// Auto-load from project root
loadEnv(__DIR__ . '/../.env');

/**
 * Get an environment variable with a default fallback
 */
function env(string $key, $default = null) {
    $value = getenv($key);
    if ($value === false) {
        return $default;
    }
    
    // Cast common values
    switch (strtolower($value)) {
        case 'true':  return true;
        case 'false': return false;
        case 'null':  return null;
    }
    
    return $value;
}
