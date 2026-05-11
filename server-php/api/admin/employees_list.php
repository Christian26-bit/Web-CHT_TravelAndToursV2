<?php
// api/admin/employees_list.php – PDO version
require __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../app/Models/Employee.php';

header('Content-Type: application/json; charset=utf-8');

$model = new Employee($pdo);
$search = isset($_GET['q']) ? trim($_GET['q']) : '';

$employees = $search !== '' ? $model->search($search) : $model->getAll();

echo json_encode(['success' => true, 'employees' => $employees]);
