<?php
/**
 * BaseModel – Provides PDO connection to all models
 */
class BaseModel {
    protected PDO $db;

    public function __construct(?PDO $pdo = null) {
        if ($pdo) {
            $this->db = $pdo;
        } else {
            require_once __DIR__ . '/../../config/database.php';
            $this->db = $GLOBALS['pdo'] ?? $pdo;
        }
    }

    /**
     * Run a SELECT query and return all rows
     */
    protected function fetchAll(string $sql, array $params = []): array {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    /**
     * Run a SELECT query and return a single row
     */
    protected function fetchOne(string $sql, array $params = []): ?array {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    /**
     * Run a SELECT query and return a single scalar value
     */
    protected function fetchColumn(string $sql, array $params = []) {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchColumn();
    }

    /**
     * Run an INSERT/UPDATE/DELETE and return affected rows
     */
    protected function execute(string $sql, array $params = []): int {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount();
    }

    /**
     * Run an INSERT and return the last insert ID
     */
    protected function insert(string $sql, array $params = []): int {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return (int) $this->db->lastInsertId();
    }
}
