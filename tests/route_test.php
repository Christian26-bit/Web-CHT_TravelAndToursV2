<?php
// Simple Route Test Script
// Run with: php tests/route_test.php

$baseUrl = 'http://localhost/CHT-Travel-and-Tours-Web/';

function testRoute($path, $method = 'GET', $expectedCode = 200) {
    global $baseUrl;
    $url = $baseUrl . $path;
    
    // Initialize cURL
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true); // Get headers
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, []); // Empty body
    }
    
    // Execute
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    // Assert
    if ($httpCode === $expectedCode) {
        echo "[PASS] $method $path -> Expected $expectedCode, got $httpCode\n";
    } else {
        echo "[FAIL] $method $path -> Expected $expectedCode, got $httpCode\n";
        echo "   Effective URL: " . curl_getinfo($ch, CURLINFO_EFFECTIVE_URL) . "\n";
        echo "   Body start: " . substr($response, 0, 1000) . "\n";
    }
}

echo "Testing Routes...\n";
echo "-----------------\n";

// Valid Routes
testRoute('login', 'GET', 200);
testRoute('admin/dashboard', 'GET', 200);
testRoute('api/login', 'POST', 400); // 400 because body is empty, but route found!

// Invalid Routes
testRoute('invalid/path', 'GET', 404);
testRoute('api/nonexistent', 'GET', 404);

// Method Not Allowed
testRoute('login', 'POST', 405); // Login view is GET only
testRoute('api/login', 'GET', 405); // API login is POST only

echo "-----------------\n";
echo "Done.\n";
?>
