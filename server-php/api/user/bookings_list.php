<?php
// api/user/bookings_list.php – PDO version
require __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../app/Models/Booking.php';

header('Content-Type: application/json; charset=utf-8');

$search = isset($_GET['q']) ? trim($_GET['q']) : '';
$status = isset($_GET['status']) ? trim($_GET['status']) : '';

$bookingModel = new Booking($pdo);

// Get bookings (recent or all)
if (isset($_GET['recent']) && $_GET['recent'] == '1') {
    $rows = $bookingModel->getRecent(5);
} else {
    $rows = $bookingModel->getAll($search, $status);
}

$bookings = [];
foreach ($rows as $row) {
    $bookings[] = [
        'id'            => (int)$row['bookingId'],
        'ref'           => 'BK-' . str_pad($row['bookingId'], 4, '0', STR_PAD_LEFT),
        'clientId'      => (int)$row['clientId'],
        'clientName'    => $row['clientName'],
        'clientEmail'   => $row['clientEmail'],
        'clientContact' => $row['clientContact'],
        'packageId'     => (int)$row['packageId'],
        'packageName'   => $row['packageName'],
        'destination'   => $row['destination'],
        'packagePrice'  => (float)$row['packagePrice'],
        'startDate'     => $row['startDate'],
        'endDate'       => $row['endDate'],
        'pax'           => (int)$row['PaxCount'],
        'totalAmount'   => (float)$row['totalAmount'],
        'paidAmount'    => (float)$row['paidAmount'],
        'status'        => ucfirst($row['status']),
    ];
}

// Get statistics
$stats = $bookingModel->getStats();

echo json_encode([
    'success'  => true,
    'bookings' => $bookings,
    'stats'    => [
        'total'     => (int)$stats['total'],
        'confirmed' => (int)$stats['confirmed'],
        'pending'   => (int)$stats['pending'],
        'cancelled' => (int)$stats['cancelled'],
        'completed' => (int)$stats['completed'],
    ],
]);
