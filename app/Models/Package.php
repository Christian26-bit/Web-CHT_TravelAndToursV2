<?php
require_once __DIR__ . '/BaseModel.php';

class Package extends BaseModel {

    public function getAll(): array {
        return $this->fetchAll("SELECT * FROM package ORDER BY Name ASC");
    }

    public function getActive(): array {
        return $this->fetchAll("SELECT * FROM package WHERE IsActive = 1 ORDER BY Name ASC");
    }

    public function findById(int $id): ?array {
        return $this->fetchOne("SELECT * FROM package WHERE PackageID = :id", ['id' => $id]);
    }

    public function search(string $query): array {
        $like = "%{$query}%";
        return $this->fetchAll(
            "SELECT * FROM package WHERE Name LIKE :q1 OR Destination LIKE :q2 OR Description LIKE :q3",
            ['q1' => $like, 'q2' => $like, 'q3' => $like]
        );
    }

    public function create(array $data): int {
        return $this->insert(
            "INSERT INTO package (Name, Description, Destination, Duration, MaxPax, Inclusions, Price, IsActive, CreatedByEmployeeID) 
             VALUES (:name, :desc, :dest, :dur, :maxPax, :incl, :price, :active, :empId)",
            [
                'name'   => $data['Name'],
                'desc'   => $data['Description'] ?? '',
                'dest'   => $data['Destination'] ?? '',
                'dur'    => $data['Duration'] ?? 1,
                'maxPax' => $data['MaxPax'] ?? 30,
                'incl'   => $data['Inclusions'] ?? '',
                'price'  => $data['Price'],
                'active' => $data['IsActive'] ?? 1,
                'empId'  => $data['CreatedByEmployeeID'] ?? null,
            ]
        );
    }

    public function update(int $id, array $data): int {
        return $this->execute(
            "UPDATE package SET Name = :name, Description = :desc, Destination = :dest, 
             Duration = :dur, MaxPax = :maxPax, Inclusions = :incl, Price = :price, 
             IsActive = :active WHERE PackageID = :id",
            [
                'name'   => $data['Name'],
                'desc'   => $data['Description'] ?? '',
                'dest'   => $data['Destination'] ?? '',
                'dur'    => $data['Duration'] ?? 1,
                'maxPax' => $data['MaxPax'] ?? 30,
                'incl'   => $data['Inclusions'] ?? '',
                'price'  => $data['Price'],
                'active' => $data['IsActive'] ?? 1,
                'id'     => $id,
            ]
        );
    }

    public function delete(int $id): int {
        return $this->execute("DELETE FROM package WHERE PackageID = :id", ['id' => $id]);
    }

    public function hasBookings(int $id): bool {
        return (int) $this->fetchColumn(
            "SELECT COUNT(*) FROM booking WHERE PackageID = :id", ['id' => $id]
        ) > 0;
    }

    public function toggleActive(int $id, bool $active): int {
        return $this->execute(
            "UPDATE package SET IsActive = :active WHERE PackageID = :id",
            ['active' => $active ? 1 : 0, 'id' => $id]
        );
    }

    public function countActive(): int {
        return (int) $this->fetchColumn("SELECT COUNT(*) FROM package WHERE IsActive = 1");
    }

    public function getPopular(int $limit = 5): array {
        return $this->fetchAll(
            "SELECT p.Name, COUNT(b.BookingID) as bookingCount 
             FROM package p 
             LEFT JOIN booking b ON p.PackageID = b.PackageID 
             WHERE p.IsActive = 1 
             GROUP BY p.PackageID, p.Name 
             ORDER BY bookingCount DESC 
             LIMIT " . (int)$limit
        );
    }

    public function getUpcoming(int $limit = 3): array {
        return $this->fetchAll(
            "SELECT p.PackageID, p.Name as packageName, p.Destination as destination,
                    p.Price as price, p.MaxPax as maxPax,
                    MIN(t.StartDate) as startDate, MAX(t.EndDate) as endDate,
                    (SELECT COUNT(*) FROM booking b WHERE b.PackageID = p.PackageID AND b.Status = 'confirmed') as booked
             FROM package p
             LEFT JOIN packagetrips pt ON p.PackageID = pt.PackageID
             LEFT JOIN trip t ON pt.TripID = t.TripID
             WHERE p.IsActive = 1
             GROUP BY p.PackageID, p.Name, p.Destination, p.Price, p.MaxPax
             ORDER BY startDate ASC
             LIMIT " . (int)$limit
        );
    }
}
