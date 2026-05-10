<?php
require_once __DIR__ . '/BaseModel.php';

class Accommodation extends BaseModel {
    public function getAll(): array {
        return $this->fetchAll(
            "SELECT accommodationId, name, address, contact, amenities, numberOfRooms, defaultRoomType 
             FROM accommodation ORDER BY name ASC"
        );
    }

    public function findById(int $id): ?array {
        return $this->fetchOne(
            "SELECT * FROM accommodation WHERE accommodationId = :id", ['id' => $id]
        );
    }
}
