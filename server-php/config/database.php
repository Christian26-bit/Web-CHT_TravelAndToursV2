<?php
/**
 * Database Configuration – PDO Connection
 * 
 * Provides a global PDO instance ($pdo) and keeps backward-compatible
 * $mysqli reference during migration period.
 */
require_once __DIR__ . '/env.php';

$DB_HOST = env('DB_HOST', 'localhost');
$DB_PORT = env('DB_PORT', 3306);
$DB_USER = env('DB_USER', 'root');
$DB_PASS = env('DB_PASS', '');
$DB_NAME = env('DB_NAME', 'cht_travel_db');

// --- PDO Connection (primary) ---
try {
    $dsn = "mysql:host={$DB_HOST};port={$DB_PORT};dbname={$DB_NAME};charset=utf8mb4";
    $pdo = new PDO($dsn, $DB_USER, $DB_PASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

// --- Legacy mysqli Connection (for backward compatibility during migration) ---
$mysqli = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, $DB_PORT);

if ($mysqli->connect_errno) {
    // Non-fatal: PDO is primary, mysqli is fallback
    $mysqli = null;
} else {
    $mysqli->set_charset('utf8mb4');
}
?>