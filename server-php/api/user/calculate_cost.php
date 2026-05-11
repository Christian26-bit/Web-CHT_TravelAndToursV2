<?php
// api/user/calculate_cost.php
require __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../app/Models/Package.php';

header('Content-Type: application/json; charset=utf-8');

// Ensure session for auth checks
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    exit(json_encode(['success' => false, 'error' => 'Unauthorized']));
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

$packageId = isset($input['packageId']) ? (int)$input['packageId'] : 0;
$pax = isset($input['pax']) ? (int)$input['pax'] : 1;
$addonsIds = isset($input['addons']) ? $input['addons'] : [];
$accommodationId = isset($input['accommodationId']) ? (int)$input['accommodationId'] : null;
$vehicleId = isset($input['vehicleId']) ? (int)$input['vehicleId'] : null;

if (!$packageId) {
    echo json_encode(['success' => false, 'error' => 'Package ID is required']);
    exit;
}

$total = 0;
$breakdown = [];

// 1. Package Cost
$stmt = $pdo->prepare("SELECT Price, DurationDays FROM tour_packages WHERE PackageID = ?");
$stmt->execute([$packageId]);
$package = $stmt->fetch();

if (!$package) {
    echo json_encode(['success' => false, 'error' => 'Package not found']);
    exit;
}

$packagePrice = (float)$package['Price'];
$duration = (int)$package['DurationDays'] ?: 1;
$packageTotal = $packagePrice * $pax;
$total += $packageTotal;
$breakdown['package'] = [
    'price_per_pax' => $packagePrice,
    'pax' => $pax,
    'total' => $packageTotal
];

// 2. Add-ons
$addonsTotal = 0;
if (!empty($addonsIds) && is_array($addonsIds)) {
    $placeholders = str_repeat('?,', count($addonsIds) - 1) . '?';
    $stmt = $pdo->prepare("SELECT AddonID, Price FROM addons WHERE AddonID IN ($placeholders)");
    $stmt->execute($addonsIds);
    $addons = $stmt->fetchAll();
    
    foreach ($addons as $addon) {
        $addonsTotal += (float)$addon['Price'];
    }
}
$total += $addonsTotal;
$breakdown['addons'] = $addonsTotal;

// 3. Hotel
$hotelTotal = 0;
if ($accommodationId) {
    $stmt = $pdo->prepare("SELECT PricePerNight FROM accommodations WHERE AccommodationID = ?");
    $stmt->execute([$accommodationId]);
    $hotel = $stmt->fetch();
    if ($hotel) {
        $hotelTotal = (float)$hotel['PricePerNight'] * $duration;
        $total += $hotelTotal;
    }
}
$breakdown['hotel'] = $hotelTotal;

// 4. Transport
$transportTotal = 0;
if ($vehicleId) {
    $stmt = $pdo->prepare("SELECT PricePerDay FROM transportation WHERE TransportationID = ?");
    $stmt->execute([$vehicleId]);
    $transport = $stmt->fetch();
    if ($transport) {
        $transportTotal = (float)$transport['PricePerDay'] * $duration;
        $total += $transportTotal;
    }
}
$breakdown['transport'] = $transportTotal;

echo json_encode([
    'success' => true,
    'total_cost' => $total,
    'breakdown' => $breakdown
]);
