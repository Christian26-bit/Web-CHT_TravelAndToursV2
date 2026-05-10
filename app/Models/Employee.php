<?php
require_once __DIR__ . '/BaseModel.php';

class Employee extends BaseModel {

    public function findByEmail(string $email): ?array {
        return $this->fetchOne(
            "SELECT employeeId, name, email, password, isManager, isActive 
             FROM employee WHERE email = :email",
            ['email' => $email]
        );
    }

    public function findById(int $id): ?array {
        return $this->fetchOne(
            "SELECT employeeId, name, email, contactNumber, isManager, isActive 
             FROM employee WHERE employeeId = :id",
            ['id' => $id]
        );
    }

    public function getAll(): array {
        return $this->fetchAll(
            "SELECT employeeId, name, email, contactNumber, isManager, isActive 
             FROM employee ORDER BY name ASC"
        );
    }

    public function getActive(): array {
        return $this->fetchAll(
            "SELECT employeeId, name, email, contactNumber, isManager, isActive 
             FROM employee WHERE isActive = 1 ORDER BY name ASC"
        );
    }

    public function search(string $query): array {
        $like = "%{$query}%";
        return $this->fetchAll(
            "SELECT employeeId, name, email, contactNumber, isManager, isActive 
             FROM employee WHERE name LIKE :q1 OR email LIKE :q2 ORDER BY name ASC",
            ['q1' => $like, 'q2' => $like]
        );
    }

    public function create(array $data): int {
        return $this->insert(
            "INSERT INTO employee (name, email, password, contactNumber, isManager, isActive) 
             VALUES (:name, :email, :password, :contact, :isManager, :isActive)",
            [
                'name'      => $data['name'],
                'email'     => $data['email'],
                'password'  => password_hash($data['password'], PASSWORD_DEFAULT),
                'contact'   => $data['contactNumber'] ?? null,
                'isManager' => $data['isManager'] ? 1 : 0,
                'isActive'  => $data['isActive'] ?? 1,
            ]
        );
    }

    public function update(int $id, array $data): int {
        if (!empty($data['password'])) {
            return $this->execute(
                "UPDATE employee SET name = :name, email = :email, password = :password, 
                 contactNumber = :contact, isManager = :isManager, isActive = :isActive 
                 WHERE employeeId = :id",
                [
                    'name'      => $data['name'],
                    'email'     => $data['email'],
                    'password'  => password_hash($data['password'], PASSWORD_DEFAULT),
                    'contact'   => $data['contactNumber'] ?? null,
                    'isManager' => $data['isManager'] ? 1 : 0,
                    'isActive'  => $data['isActive'] ?? 1,
                    'id'        => $id,
                ]
            );
        }
        return $this->execute(
            "UPDATE employee SET name = :name, email = :email, 
             contactNumber = :contact, isManager = :isManager, isActive = :isActive 
             WHERE employeeId = :id",
            [
                'name'      => $data['name'],
                'email'     => $data['email'],
                'contact'   => $data['contactNumber'] ?? null,
                'isManager' => $data['isManager'] ? 1 : 0,
                'isActive'  => $data['isActive'] ?? 1,
                'id'        => $id,
            ]
        );
    }

    public function delete(int $id): int {
        return $this->execute("DELETE FROM employee WHERE employeeId = :id", ['id' => $id]);
    }

    public function hasBookings(int $id): bool {
        return (int) $this->fetchColumn(
            "SELECT COUNT(*) FROM booking WHERE EmployeeID = :id", ['id' => $id]
        ) > 0;
    }

    public function toggleActive(int $id, bool $active): int {
        return $this->execute(
            "UPDATE employee SET isActive = :active WHERE employeeId = :id",
            ['active' => $active ? 1 : 0, 'id' => $id]
        );
    }

    public function updatePassword(int $id, string $hashedPassword): int {
        return $this->execute(
            "UPDATE employee SET password = :pw WHERE employeeId = :id",
            ['pw' => $hashedPassword, 'id' => $id]
        );
    }

    public function getPerformance(int $limit = 5): array {
        return $this->fetchAll(
            "SELECT e.name, COUNT(b.BookingID) as bookingCount, 
                    COALESCE(SUM(pay.amount), 0) as totalSales 
             FROM employee e 
             LEFT JOIN booking b ON e.employeeId = b.EmployeeID 
             LEFT JOIN payment pay ON b.BookingID = pay.bookingId AND pay.status = 'PAID' 
             WHERE e.isActive = 1 
             GROUP BY e.employeeId, e.name 
             ORDER BY bookingCount DESC, totalSales DESC 
             LIMIT :lim",
            ['lim' => $limit]
        );
    }
}
