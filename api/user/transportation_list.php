<?php
// api/user/transportation_list.php – PDO version
require __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../app/Models/Vehicle.php';

header('Content-Type: application/json; charset=utf-8');

$model = new Vehicle($pdo);
$vehicles = $model->getAll();

echo json_encode(['success' => true, 'vehicles' => $vehicles]);
