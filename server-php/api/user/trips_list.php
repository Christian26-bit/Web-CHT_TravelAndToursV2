<?php
// api/user/trips_list.php – PDO version
require __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../app/Models/Trip.php';

header('Content-Type: application/json; charset=utf-8');

$tripModel = new Trip($pdo);
$packageId = isset($_GET['package_id']) ? (int)$_GET['package_id'] : 0;

if ($packageId > 0) {
    $trips = $tripModel->getByPackage($packageId);
} else {
    $trips = $tripModel->getAll();
}

echo json_encode(['success' => true, 'trips' => $trips]);
