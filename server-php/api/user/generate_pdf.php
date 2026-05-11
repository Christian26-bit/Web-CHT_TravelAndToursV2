<?php
// api/user/generate_pdf.php
require __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../app/Models/Booking.php';

use Dompdf\Dompdf;
use Dompdf\Options;

// Ensure session for auth checks
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    header('HTTP/1.1 401 Unauthorized');
    exit('Unauthorized access.');
}

if (!isset($_GET['booking_id'])) {
    header('HTTP/1.1 400 Bad Request');
    exit('Booking ID is required.');
}

$bookingId = (int)$_GET['booking_id'];
$bookingModel = new Booking($pdo);

// Get booking details
$booking = null;
$list = $bookingModel->getAll(); // For now, we search the full list to get joined data. Ideally we'd have a getById with joins.
foreach ($list as $b) {
    if ($b['id'] == $bookingId) {
        $booking = $b;
        break;
    }
}

if (!$booking) {
    header('HTTP/1.1 404 Not Found');
    exit('Booking not found.');
}

// Generate HTML Content
$html = '
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #1e3a8a; margin: 0; font-size: 28px; }
        .header p { margin: 5px 0 0 0; color: #64748b; }
        .invoice-details { width: 100%; margin-bottom: 30px; }
        .invoice-details td { padding: 5px; vertical-align: top; }
        .title { font-weight: bold; color: #475569; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .table th { background-color: #f1f5f9; padding: 12px; text-align: left; border-bottom: 2px solid #cbd5e1; }
        .table td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
        .total-row td { font-weight: bold; border-top: 2px solid #cbd5e1; }
        .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #94a3b8; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .badge.completed { background-color: #dcfce7; color: #166534; }
        .badge.pending { background-color: #fef9c3; color: #854d0e; }
        .badge.cancelled { background-color: #fee2e2; color: #991b1b; }
    </style>
</head>
<body>
    <div class="header">
        <h1>CHT Travel & Tours</h1>
        <p>Your Ultimate Travel Partner</p>
    </div>

    <table class="invoice-details">
        <tr>
            <td width="50%">
                <h3 style="margin-top:0;">Booking Confirmation / Invoice</h3>
                <span class="title">Booking Ref:</span> ' . htmlspecialchars($booking['ref']) . '<br>
                <span class="title">Date Issued:</span> ' . date('F j, Y') . '<br>
                <span class="title">Status:</span> ' . strtoupper(htmlspecialchars($booking['status'])) . '
            </td>
            <td width="50%" style="text-align:right;">
                <h3 style="margin-top:0;">Billed To</h3>
                ' . htmlspecialchars($booking['clientName']) . '<br>
                ' . htmlspecialchars($booking['clientEmail']) . '<br>
            </td>
        </tr>
    </table>

    <table class="table">
        <thead>
            <tr>
                <th>Description</th>
                <th>Dates</th>
                <th>Pax</th>
                <th style="text-align:right;">Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <strong>' . htmlspecialchars($booking['packageName']) . '</strong><br>
                    <small>Destination: ' . htmlspecialchars($booking['destination']) . '</small>
                </td>
                <td>
                    ' . date('M d, Y', strtotime($booking['startDate'])) . ' - <br>
                    ' . date('M d, Y', strtotime($booking['endDate'])) . '
                </td>
                <td>' . (int)$booking['pax'] . '</td>
                <td style="text-align:right;">PHP ' . number_format($booking['totalAmount'], 2) . '</td>
            </tr>
            <tr class="total-row">
                <td colspan="3" style="text-align:right;">Total Amount:</td>
                <td style="text-align:right;">PHP ' . number_format($booking['totalAmount'], 2) . '</td>
            </tr>
            <tr>
                <td colspan="3" style="text-align:right;">Amount Paid:</td>
                <td style="text-align:right;">PHP ' . number_format($booking['paidAmount'], 2) . '</td>
            </tr>
            <tr class="total-row">
                <td colspan="3" style="text-align:right;">Balance Due:</td>
                <td style="text-align:right; color: #b91c1c;">PHP ' . number_format(max(0, $booking['totalAmount'] - $booking['paidAmount']), 2) . '</td>
            </tr>
        </tbody>
    </table>

    <div class="footer">
        <p>Thank you for choosing CHT Travel & Tours!</p>
        <p>If you have any questions concerning this invoice, contact our support team.</p>
    </div>
</body>
</html>';

// Initialize Dompdf
$options = new Options();
$options->set('isHtml5ParserEnabled', true);
$options->set('isRemoteEnabled', true);

$dompdf = new Dompdf($options);
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();

// Output the generated PDF to Browser
$dompdf->stream("booking_invoice_" . $booking['ref'] . ".pdf", ["Attachment" => false]);
