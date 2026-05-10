<?php
// api/user/payments_save.php – PDO version
require __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../app/Models/Payment.php';

header('Content-Type: application/json; charset=utf-8');

$paymentModel = new Payment($pdo);

$data = [
    'bookingId'       => (int)($_POST['bookingId'] ?? 0),
    'amount'          => (float)($_POST['amount'] ?? 0),
    'paymentDate'     => $_POST['paymentDate'] ?? date('Y-m-d'),
    'method'          => trim($_POST['method'] ?? ''),
    'status'          => $_POST['status'] ?? 'PENDING',
    'referenceNumber' => trim($_POST['referenceNumber'] ?? ''),
];

if ($data['bookingId'] <= 0 || $data['amount'] <= 0 || $data['method'] === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Booking ID, amount, and method are required.']);
    exit;
}

try {
    $id = $paymentModel->create($data);
    echo json_encode(['success' => true, 'message' => 'Payment recorded.', 'paymentId' => $id]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
