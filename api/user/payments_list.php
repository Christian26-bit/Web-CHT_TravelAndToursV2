<?php
// api/user/payments_list.php – PDO version
require __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../app/Models/Payment.php';

header('Content-Type: application/json; charset=utf-8');

$paymentModel = new Payment($pdo);

$bookingId = isset($_GET['booking_id']) ? (int)$_GET['booking_id'] : 0;

if ($bookingId > 0) {
    $payments = $paymentModel->getByBooking($bookingId);
} else {
    $payments = $paymentModel->getAll();
}

echo json_encode(['success' => true, 'payments' => $payments]);
