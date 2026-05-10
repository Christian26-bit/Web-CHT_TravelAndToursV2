<?php
// api/user/dashboard_summary.php – PDO version
require __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../app/Models/Booking.php';
require_once __DIR__ . '/../../app/Models/Client.php';

header('Content-Type: application/json; charset=utf-8');

$bookingModel = new Booking($pdo);
$clientModel = new Client($pdo);

$clientCount = $clientModel->count();
$tripStats = $bookingModel->getDashboardStats(); // Returns CompletedTrips, OngoingTrips, UpcomingTrips
$recentBookings = $bookingModel->getRecent(5);

$recentFormatted = [];
foreach ($recentBookings as $row) {
    $recentFormatted[] = [
        'id'            => (int)$row['bookingId'],
        'clientName'    => $row['clientName'],
        'destination'   => $row['destination'],
        'packageName'   => $row['packageName'],
        'startDate'     => $row['startDate'],
        'endDate'       => $row['endDate'],
        'status'        => ucfirst($row['status']),
    ];
}

echo json_encode([
    'success' => true,
    'metrics' => [
        'totalCustomers' => $clientCount,
        'ongoingTrips'   => (int)$tripStats['OngoingTrips'],
        'upcomingTrips'  => (int)$tripStats['UpcomingTrips'],
        'completedTrips' => (int)$tripStats['CompletedTrips'],
    ],
    'recentBookings' => $recentFormatted,
]);
