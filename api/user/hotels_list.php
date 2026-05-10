<?php
// api/user/hotels_list.php – PDO version
require __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../app/Models/Accommodation.php';

header('Content-Type: application/json; charset=utf-8');

$model = new Accommodation($pdo);
$hotels = $model->getAll();

echo json_encode(['success' => true, 'hotels' => $hotels]);
