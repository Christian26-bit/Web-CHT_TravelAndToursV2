<?php
/**
 * CSRF Protection Middleware
 * Generates and validates CSRF tokens for POST requests
 */
class CsrfMiddleware {

    /**
     * Generate a CSRF token and store in session
     */
    public static function generateToken(): string {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

    /**
     * Get the hidden input HTML for forms
     */
    public static function field(): string {
        $token = self::generateToken();
        return '<input type="hidden" name="_csrf_token" value="' . htmlspecialchars($token) . '">';
    }

    /**
     * Validate the CSRF token from request
     */
    public static function validate(): void {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return;
        }

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // Check header first (for AJAX), then POST body
        $token = $_SERVER['HTTP_X_CSRF_TOKEN'] 
              ?? $_POST['_csrf_token'] 
              ?? '';

        if (empty($token) || !hash_equals($_SESSION['csrf_token'] ?? '', $token)) {
            http_response_code(403);
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'error' => 'Invalid CSRF token']);
            exit;
        }
    }
}
