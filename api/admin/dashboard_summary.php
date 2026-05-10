<?php
// api/admin/dashboard_summary.php – PDO version
require __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../app/Models/Booking.php';
require_once __DIR__ . '/../../app/Models/Package.php';
require_once __DIR__ . '/../../app/Models/Payment.php';
require_once __DIR__ . '/../../app/Models/Client.php';

header('Content-Type: application/json; charset=utf-8');

$bookingModel = new Booking($pdo);
$packageModel = new Package($pdo);
$paymentModel = new Payment($pdo);
$clientModel  = new Client($pdo);

$response = [
    'success'        => true,
    'totalBookings'  => $bookingModel->count(),
    'activeTours'    => $packageModel->countActive(),
    'monthlyRevenue' => $paymentModel->getTotalPaid(),
    'newCustomers'   => $clientModel->count(),
    'upcomingTours'  => [],
    'recentBookings' => [],
];

// Upcoming Tours
$tours = $packageModel->getUpcoming(3);
foreach ($tours as $tour) {
    $response['upcomingTours'][] = [
        'id'          => $tour['PackageID'],
        'packageName' => $tour['packageName'],
        'destination' => $tour['destination'],
        'price'       => $tour['price'],
        'maxPax'      => $tour['maxPax'],
        'booked'      => (int)$tour['booked'],
        'startDate'   => $tour['startDate'] ? date('M d, Y', strtotime($tour['startDate'])) : null,
        'endDate'     => $tour['endDate'] ? date('M d, Y', strtotime($tour['endDate'])) : null,
        'image'       => null,
    ];
}

// Recent Bookings
$response['recentBookings'] = $bookingModel->getRecentWithStatus(10);

echo json_encode($response);
