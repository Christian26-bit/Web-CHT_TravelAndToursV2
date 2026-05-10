<?php
// api/admin/employee_toggle.php – PDO version
require __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../app/Models/Employee.php';

header('Content-Type: application/json; charset=utf-8');

$model = new Employee($pdo);
$id = (int)($_POST['employeeId'] ?? $_POST['id'] ?? 0);
$active = isset($_POST['isActive']) ? (bool)$_POST['isActive'] : true;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Employee ID required.']);
    exit;
}

$model->toggleActive($id, $active);
echo json_encode(['success' => true, 'message' => $active ? 'Employee activated.' : 'Employee deactivated.']);
