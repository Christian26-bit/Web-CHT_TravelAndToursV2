<?php
require_once __DIR__ . '/BaseModel.php';

class Vehicle extends BaseModel {
    public function getAll(): array {
        return $this->fetchAll(
            "SELECT VehicleID, Type, Capacity, PlateNumber, ProviderName FROM vehicle ORDER BY Type"
        );
    }

    public function getLandVehicles(): array {
        return $this->fetchAll(
            "SELECT VehicleID, Type, Capacity, PlateNumber, ProviderName 
             FROM vehicle WHERE Type != 'Plane'"
        );
    }
}
