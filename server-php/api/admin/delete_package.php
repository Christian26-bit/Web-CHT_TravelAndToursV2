<?php
// api/admin/delete_package.php – PDO version
require __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../app/Models/Package.php';

header('Content-Type: application/json; charset=utf-8');

$model = new Package($pdo);
$id = (int)($_POST['packageId'] ?? $_POST['id'] ?? 0);

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Package ID required.']);
    exit;
}

if ($model->hasBookings($id)) {
    $model->toggleActive($id, false);
    echo json_encode(['success' => true, 'message' => 'Package deactivated (has existing bookings).']);
} else {
    $model->delete($id);
    echo json_encode(['success' => true, 'message' => 'Package deleted.']);
}
