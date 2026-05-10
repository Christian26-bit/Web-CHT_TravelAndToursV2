<?php
// api/admin/list_packages.php – PDO version
require __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../app/Models/Package.php';

header('Content-Type: application/json; charset=utf-8');

$model = new Package($pdo);
$packages = $model->getAll();

echo json_encode(['success' => true, 'packages' => $packages]);
