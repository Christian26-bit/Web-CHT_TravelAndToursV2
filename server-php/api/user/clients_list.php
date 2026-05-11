<?php
// api/user/clients_list.php – PDO version
require __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../app/Models/Client.php';

header('Content-Type: application/json; charset=utf-8');

$clientModel = new Client($pdo);
$search = isset($_GET['q']) ? trim($_GET['q']) : '';

$clients = $search !== '' ? $clientModel->search($search) : $clientModel->getAll();

echo json_encode(['success' => true, 'clients' => $clients]);
