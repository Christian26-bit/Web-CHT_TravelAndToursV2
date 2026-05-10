<?php
// index.php – Main Router with Middleware Support

// Start session early for all requests
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Load middleware
require_once __DIR__ . '/app/Middleware/AuthMiddleware.php';
require_once __DIR__ . '/app/Middleware/CsrfMiddleware.php';

// Router logic
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$scriptName = $_SERVER['SCRIPT_NAME'];
$scriptDir = dirname($scriptName);

// Remove the project directory from the request URI to get the internal path
if (strpos($requestUri, $scriptDir) === 0) {
    $path = substr($requestUri, strlen($scriptDir));
} else {
    $path = $requestUri;
}

// Ensure scriptDir has a trailing slash for the base tag
$baseUrl = rtrim($scriptDir, '/\\') . '/';

// Remove leading/trailing slash
$path = trim($path, '/');

// Default route
if ($path === '' || $path === 'index.php') {
    $path = 'login';
}

// Load Routes Configuration
$routes = require __DIR__ . '/config/routes.php';

// Helper function for error responses
function sendError($code, $message, $isApi) {
    http_response_code($code);
    if ($isApi) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => $message]);
    } else {
        // Log the error
        $logFile = __DIR__ . '/logs/error.log';
        $timestamp = date('Y-m-d H:i:s');
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
        $path = htmlspecialchars($_SERVER['REQUEST_URI'] ?? 'Unknown');
        $logMessage = "[$timestamp] $code $message: $path (IP: $ip)\n";
        file_put_contents($logFile, $logMessage, FILE_APPEND);
        
        // Use global $baseUrl for the view
        global $baseUrl; 
        if ($code === 404) {
            require __DIR__ . '/views/404.php';
        } else {
            echo "Error $code: $message";
        }
    }
    exit;
}

// Check if it's an API request
$isApi = (strpos($path, 'api/') === 0) || 
         (!empty($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false);

// Route Matching
if (array_key_exists($path, $routes)) {
    $route = $routes[$path];
    $method = $_SERVER['REQUEST_METHOD'];

    // Method Validation
    if (!in_array($method, $route['methods'])) {
        sendError(405, "Method Not Allowed", $isApi);
    }

    // Execute Middleware
    if (!empty($route['middleware'])) {
        foreach ($route['middleware'] as $mw) {
            switch ($mw) {
                case 'auth':
                    AuthMiddleware::check();
                    break;
                case 'admin':
                    AuthMiddleware::requireAdmin();
                    break;
                case 'user':
                    AuthMiddleware::requireUser();
                    break;
                case 'csrf':
                    CsrfMiddleware::validate();
                    break;
            }
        }
    }

    // Check file existence
    $file = __DIR__ . '/' . $route['file'];
    if (file_exists($file)) {
        require $file;
    } else {
        // Configuration error: Route exists but file is missing
        sendError(500, "Internal Server Error: Handler not found", $isApi);
    }

} else {
    sendError(404, "Page Not Found", $isApi);
}
?>
