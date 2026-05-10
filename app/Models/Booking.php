<?php
require_once __DIR__ . '/BaseModel.php';

class Booking extends BaseModel {

    public function getAll(string $search = '', string $status = ''): array {
        $sql = "SELECT b.BookingID as bookingId, b.ClientID as clientId, c.name as clientName,
                       c.email as clientEmail, c.contactNumber as clientContact,
                       b.PackageID as packageId, p.Name as packageName, p.Destination as destination,
                       p.Price as packagePrice, b.BookingDate as startDate, b.BookingDate as endDate,
                       b.PaxCount, b.Status as status,
                       COALESCE(SUM(pay.amount), 0) as paidAmount,
                       (p.Price * b.PaxCount) as totalAmount
                FROM booking b
                LEFT JOIN client c ON b.ClientID = c.clientId
                LEFT JOIN package p ON b.PackageID = p.PackageID
                LEFT JOIN payment pay ON b.BookingID = pay.bookingId
                WHERE 1=1";
        $params = [];

        if ($search !== '') {
            $like = "%{$search}%";
            $sql .= " AND (c.name LIKE :s1 OR p.Name LIKE :s2 OR p.Destination LIKE :s3)";
            $params['s1'] = $like;
            $params['s2'] = $like;
            $params['s3'] = $like;
        }

        if ($status !== '' && $status !== 'all') {
            $sql .= " AND b.Status = :status";
            $params['status'] = $status;
        }

        $sql .= " GROUP BY b.BookingID ORDER BY b.BookingDate DESC";
        return $this->fetchAll($sql, $params);
    }

    public function getRecent(int $limit = 5): array {
        return $this->fetchAll(
            "SELECT b.BookingID as bookingId, b.ClientID as clientId, c.name as clientName,
                    c.email as clientEmail, c.contactNumber as clientContact,
                    b.PackageID as packageId, p.Name as packageName, p.Destination as destination,
                    p.Price as packagePrice, b.BookingDate as startDate, b.BookingDate as endDate,
                    b.PaxCount, b.Status as status,
                    COALESCE(SUM(pay.amount), 0) as paidAmount,
                    (p.Price * b.PaxCount) as totalAmount
             FROM booking b
             LEFT JOIN client c ON b.ClientID = c.clientId
             LEFT JOIN package p ON b.PackageID = p.PackageID
             LEFT JOIN payment pay ON b.BookingID = pay.bookingId
             WHERE b.BookingDate >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
             GROUP BY b.BookingID ORDER BY b.BookingDate DESC
             LIMIT " . (int)$limit
        );
    }

    public function findById(int $id): ?array {
        return $this->fetchOne(
            "SELECT b.*, c.name as clientName, c.email as clientEmail, 
                    p.Name as packageName, p.Destination, p.Price as packagePrice
             FROM booking b
             LEFT JOIN client c ON b.ClientID = c.clientId
             LEFT JOIN package p ON b.PackageID = p.PackageID
             WHERE b.BookingID = :id",
            ['id' => $id]
        );
    }

    public function create(array $data): int {
        return $this->insert(
            "INSERT INTO booking (EmployeeID, ClientID, PackageID, BookingDate, Status, PaxCount)
             VALUES (:empId, :clientId, :pkgId, :date, :status, :pax)",
            [
                'empId'    => $data['EmployeeID'],
                'clientId' => $data['ClientID'],
                'pkgId'    => $data['PackageID'],
                'date'     => $data['BookingDate'] ?? date('Y-m-d'),
                'status'   => $data['Status'] ?? 'pending',
                'pax'      => $data['PaxCount'] ?? 1,
            ]
        );
    }

    public function updateStatus(int $id, string $status): int {
        return $this->execute(
            "UPDATE booking SET Status = :status WHERE BookingID = :id",
            ['status' => $status, 'id' => $id]
        );
    }

    public function delete(int $id): int {
        return $this->execute("DELETE FROM booking WHERE BookingID = :id", ['id' => $id]);
    }

    public function count(): int {
        return (int) $this->fetchColumn("SELECT COUNT(*) FROM booking");
    }

    public function getStats(): array {
        $row = $this->fetchOne(
            "SELECT COUNT(*) as total,
                    SUM(CASE WHEN LOWER(Status) = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
                    SUM(CASE WHEN LOWER(Status) = 'pending'   THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN LOWER(Status) = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
                    SUM(CASE WHEN LOWER(Status) = 'completed' THEN 1 ELSE 0 END) as completed
             FROM booking"
        );
        return $row ?: ['total' => 0, 'confirmed' => 0, 'pending' => 0, 'cancelled' => 0, 'completed' => 0];
    }

    public function getDashboardStats(): array {
        $row = $this->fetchOne(
            "SELECT 
                SUM(IF(TripEndDate < CURRENT_DATE, 1, 0)) AS CompletedTrips,
                SUM(IF(TripStartDate <= CURRENT_DATE AND TripEndDate >= CURRENT_DATE, 1, 0)) AS OngoingTrips,
                SUM(IF(TripStartDate > CURRENT_DATE, 1, 0)) AS UpcomingTrips
             FROM (
                SELECT MIN(T.StartDate) AS TripStartDate, MAX(T.EndDate) AS TripEndDate
                FROM booking B
                JOIN packagetrips PT ON B.PackageID = PT.PackageID
                JOIN trip T ON PT.TripID = T.TripID
                WHERE B.Status = 'confirmed'
                GROUP BY B.BookingID
             ) AS BookingDates"
        );
        return $row ?: ['CompletedTrips' => 0, 'OngoingTrips' => 0, 'UpcomingTrips' => 0];
    }

    public function getRecentWithStatus(int $limit = 10): array {
        return $this->fetchAll(
            "SELECT b.BookingID as id, c.name as client, p.Name as package, 
                    p.Destination as destination,
                    DATE_FORMAT(b.BookingDate, '%b %d, %Y') as date,
                    b.Status as status
             FROM booking b
             LEFT JOIN client c ON b.ClientID = c.clientId
             LEFT JOIN package p ON b.PackageID = p.PackageID
             ORDER BY b.BookingDate DESC
             LIMIT " . (int)$limit
        );
    }
}
