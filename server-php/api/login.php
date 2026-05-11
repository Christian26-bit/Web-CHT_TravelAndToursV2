<?php
// api/login.php – Authentication with PDO + dual-mode password verification
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../app/Models/Employee.php';

header('Content-Type: application/json; charset=utf-8');

// Get POST data (handle both form-data and JSON)
$data = json_decode(file_get_contents('php://input'), true);
$email    = trim($_POST['email'] ?? $data['email'] ?? '');
$password = $_POST['password'] ?? $data['password'] ?? '';

if ($email === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email and password are required.']);
    exit;
}

// Use Employee model with PDO
$employeeModel = new Employee($pdo);
$row = $employeeModel->findByEmail($email);

if ($row) {
    // Check if account is active
    if (!$row['isActive']) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Account is inactive. Contact administrator.']);
        exit;
    }

    $passwordValid = false;

    // Verify using modern password_verify (Project Standard)
    if (password_verify($password, $row['password'])) {
        $passwordValid = true;
    }
    // Fallback: SHA1 (Legacy support)
    elseif (sha1($password) === $row['password']) {
        $passwordValid = true;
    }
    // Fallback: plain text match (Seed accounts)
    elseif ($password === $row['password']) {
        $passwordValid = true;
    }

    if ($passwordValid) {
        // Regenerate session ID to prevent fixation
        session_regenerate_id(true);

        $_SESSION['user_id'] = $row['employeeId'];
        $_SESSION['email']   = $row['email'];
        $_SESSION['name']    = $row['name'];
        $_SESSION['role']    = $row['isManager'] ? 'admin' : 'user';

        // Generate CSRF token
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));

        echo json_encode([
            'success'    => true,
            'role'       => $row['isManager'] ? 'admin' : 'user',
            'name'       => $row['name'],
            'email'      => $row['email'],
            'token'      => $_SESSION['csrf_token'],
            'csrf_token' => $_SESSION['csrf_token'],
        ]);
        exit;
    }
}

// Login failed
http_response_code(401);
echo json_encode(['success' => false, 'error' => 'Invalid email or password.']);
