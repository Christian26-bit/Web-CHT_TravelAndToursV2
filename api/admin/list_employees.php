<?php
// api/admin/list_employees.php – PDO version (alias for employees_list)
require __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../app/Models/Employee.php';

header('Content-Type: application/json; charset=utf-8');

$model = new Employee($pdo);
$employees = $model->getAll();

echo json_encode(['success' => true, 'employees' => $employees]);
