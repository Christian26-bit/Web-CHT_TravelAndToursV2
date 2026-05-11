<?php
// api/admin/delete_employee.php – PDO version
require __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../app/Models/Employee.php';

header('Content-Type: application/json; charset=utf-8');

$model = new Employee($pdo);
$id = (int)($_POST['employeeId'] ?? $_POST['id'] ?? 0);

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Employee ID required.']);
    exit;
}

if ($model->hasBookings($id)) {
    // Deactivate instead of delete
    $model->toggleActive($id, false);
    echo json_encode(['success' => true, 'message' => 'Employee deactivated (has existing bookings).']);
} else {
    $model->delete($id);
    echo json_encode(['success' => true, 'message' => 'Employee deleted.']);
}
