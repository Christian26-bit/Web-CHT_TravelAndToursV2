<?php
// api/user/clients_save.php – PDO version
require __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../app/Models/Client.php';

header('Content-Type: application/json; charset=utf-8');

$clientModel = new Client($pdo);

$data = [
    'name'          => trim($_POST['name'] ?? ''),
    'email'         => trim($_POST['email'] ?? ''),
    'contactNumber' => trim($_POST['contactNumber'] ?? ''),
    'address'       => trim($_POST['address'] ?? ''),
    'customerType'  => $_POST['customerType'] ?? 'REGULAR',
];

if ($data['name'] === '' || $data['email'] === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name and email are required.']);
    exit;
}

$clientId = isset($_POST['clientId']) ? (int)$_POST['clientId'] : 0;

try {
    if ($clientId > 0) {
        $clientModel->update($clientId, $data);
        echo json_encode(['success' => true, 'message' => 'Client updated.', 'clientId' => $clientId]);
    } else {
        $newId = $clientModel->create($data);
        echo json_encode(['success' => true, 'message' => 'Client created.', 'clientId' => $newId]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
