<?php
/**
 * Authentication Middleware
 * Checks for valid session and enforces role-based access
 */
class AuthMiddleware {
    
    /**
     * Ensure user is logged in
     */
    public static function check(): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if (empty($_SESSION['user_id'])) {
            $isApi = self::isApiRequest();
            if ($isApi) {
                http_response_code(401);
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'error' => 'Authentication required']);
                exit;
            }
            // Redirect to login
            global $baseUrl;
            header('Location: ' . ($baseUrl ?? '/') . 'login');
            exit;
        }
    }

    /**
     * Ensure user is an admin (manager)
     */
    public static function requireAdmin(): void {
        self::check();
        
        if (($_SESSION['role'] ?? '') !== 'admin') {
            $isApi = self::isApiRequest();
            if ($isApi) {
                http_response_code(403);
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'error' => 'Admin access required']);
                exit;
            }
            global $baseUrl;
            header('Location: ' . ($baseUrl ?? '/') . 'user/dashboard');
            exit;
        }
    }

    /**
     * Ensure user is a regular staff member
     */
    public static function requireUser(): void {
        self::check();
    }

    /**
     * Get current session user data
     */
    public static function user(): ?array {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        if (empty($_SESSION['user_id'])) {
            return null;
        }
        return [
            'id'    => $_SESSION['user_id'],
            'email' => $_SESSION['email'] ?? '',
            'name'  => $_SESSION['name'] ?? '',
            'role'  => $_SESSION['role'] ?? 'user',
        ];
    }

    private static function isApiRequest(): bool {
        $uri = $_SERVER['REQUEST_URI'] ?? '';
        return strpos($uri, '/api/') !== false ||
               (!empty($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false);
    }
}
