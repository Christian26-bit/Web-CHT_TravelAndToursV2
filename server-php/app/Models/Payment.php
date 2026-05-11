<?php
require_once __DIR__ . '/BaseModel.php';

class Payment extends BaseModel {

    public function getAll(): array {
        return $this->fetchAll(
            "SELECT p.*, c.name as clientName, pkg.Name as packageName
             FROM payment p
             LEFT JOIN booking b ON p.bookingId = b.BookingID
             LEFT JOIN client c ON b.ClientID = c.clientId
             LEFT JOIN package pkg ON b.PackageID = pkg.PackageID
             ORDER BY p.paymentDate DESC"
        );
    }

    public function getByBooking(int $bookingId): array {
        return $this->fetchAll(
            "SELECT * FROM payment WHERE bookingId = :bid ORDER BY paymentDate DESC",
            ['bid' => $bookingId]
        );
    }

    public function create(array $data): int {
        return $this->insert(
            "INSERT INTO payment (bookingId, amount, paymentDate, method, status, referenceNumber)
             VALUES (:bid, :amount, :date, :method, :status, :ref)",
            [
                'bid'    => $data['bookingId'],
                'amount' => $data['amount'],
                'date'   => $data['paymentDate'] ?? date('Y-m-d'),
                'method' => $data['method'],
                'status' => $data['status'] ?? 'PENDING',
                'ref'    => $data['referenceNumber'] ?? null,
            ]
        );
    }

    public function getTotalPaid(): float {
        return (float) $this->fetchColumn(
            "SELECT COALESCE(SUM(amount), 0) FROM payment WHERE status = 'PAID'"
        );
    }
}
