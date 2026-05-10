<?php
require_once __DIR__ . '/BaseModel.php';

class Trip extends BaseModel {
    public function getAll(): array {
        return $this->fetchAll("SELECT * FROM trip ORDER BY StartDate");
    }

    public function getByPackage(int $packageId): array {
        return $this->fetchAll(
            "SELECT t.* FROM trip t 
             INNER JOIN packagetrips pt ON t.TripID = pt.TripID 
             WHERE pt.PackageID = :pid ORDER BY pt.Sequence",
            ['pid' => $packageId]
        );
    }

    public function findById(int $id): ?array {
        return $this->fetchOne("SELECT * FROM trip WHERE TripID = :id", ['id' => $id]);
    }
}
