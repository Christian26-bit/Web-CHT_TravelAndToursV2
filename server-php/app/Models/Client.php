<?php
require_once __DIR__ . '/BaseModel.php';

class Client extends BaseModel {

    public function getAll(): array {
        return $this->fetchAll("SELECT * FROM client ORDER BY name ASC");
    }

    public function findById(int $id): ?array {
        return $this->fetchOne("SELECT * FROM client WHERE clientId = :id", ['id' => $id]);
    }

    public function search(string $query): array {
        $like = "%{$query}%";
        return $this->fetchAll(
            "SELECT * FROM client WHERE name LIKE :q1 OR email LIKE :q2 OR clientId = :q3 LIMIT 10",
            ['q1' => $like, 'q2' => $like, 'q3' => is_numeric($query) ? (int)$query : 0]
        );
    }

    public function create(array $data): int {
        return $this->insert(
            "INSERT INTO client (name, email, address, contactNumber, customerType, dateRegistered) 
             VALUES (:name, :email, :address, :contact, :type, :registered)",
            [
                'name'       => $data['name'],
                'email'      => $data['email'],
                'address'    => $data['address'] ?? '',
                'contact'    => $data['contactNumber'],
                'type'       => $data['customerType'] ?? 'REGULAR',
                'registered' => $data['dateRegistered'] ?? date('Y-m-d'),
            ]
        );
    }

    public function update(int $id, array $data): int {
        return $this->execute(
            "UPDATE client SET name = :name, email = :email, contactNumber = :contact, 
             address = :address, customerType = :type WHERE clientId = :id",
            [
                'name'    => $data['name'],
                'email'   => $data['email'],
                'contact' => $data['contactNumber'],
                'address' => $data['address'] ?? '',
                'type'    => $data['customerType'] ?? 'REGULAR',
                'id'      => $id,
            ]
        );
    }

    public function delete(int $id): int {
        return $this->execute("DELETE FROM client WHERE clientId = :id", ['id' => $id]);
    }

    public function count(): int {
        return (int) $this->fetchColumn("SELECT COUNT(*) FROM client");
    }

    public function getWithBookingHistory(): array {
        return $this->fetchAll(
            "SELECT DISTINCT c.clientId, c.name, c.email, c.contactNumber, c.customerType,
                    c.address, c.dateRegistered, p.Destination, b.Status,
                    CONCAT(MIN(t.StartDate), ' to ', MAX(t.EndDate)) AS TripDates
             FROM client c
             LEFT JOIN booking b ON c.clientId = b.ClientID
             LEFT JOIN package p ON b.PackageID = p.PackageID
             LEFT JOIN packagetrips pt ON p.PackageID = pt.PackageID
             LEFT JOIN trip t ON pt.TripID = t.TripID
             GROUP BY c.clientId, c.name, c.email, c.contactNumber, c.customerType,
                      c.address, c.dateRegistered, p.Destination, b.Status
             ORDER BY c.name ASC"
        );
    }
}
