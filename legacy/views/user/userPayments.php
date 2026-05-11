<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <base href="<?php echo $baseUrl; ?>" >
    <script>const BASE_URL = "<?php echo $baseUrl; ?>";</script>
    <meta name="csrf-token" content="<?php echo htmlspecialchars($_SESSION['csrf_token'] ?? ''); ?>">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CHT Travel - Payments</title>
    <link rel="stylesheet" href="assets/css/customer-view.css">
</head>
<body class="cv-body">

    <?php include __DIR__ . '/sidebar.php'; ?>

    <main class="cv-content">
        <?php include __DIR__ . '/topbar.php'; ?>

        <div class="cv-main">
            <!-- HEADER -->
            <div class="cv-section-header" style="display:flex; justify-content:space-between; align-items:flex-end;">
                <div>
                    <h1 class="cv-page-title">Payments</h1>
                    <p class="cv-page-subtitle">Track payment records and transactions</p>
                </div>
                <button class="cv-btn cv-btn-primary" onclick="window.location.href = BASE_URL + 'bookings/1'">
                    <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                    New Payment
                </button>
            </div>

            <!-- STATS CARDS -->
            <div class="cv-metrics-grid" style="grid-template-columns: repeat(3, 1fr);">
                <div class="cv-metric-card">
                    <div>
                        <p class="cv-metric-label">Total Received</p>
                        <p class="cv-metric-value" id="statReceived">--</p>
                    </div>
                    <div class="cv-metric-icon green">
                        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    </div>
                </div>
                <div class="cv-metric-card">
                    <div>
                        <p class="cv-metric-label">Pending Total</p>
                        <p class="cv-metric-value" id="statPending">--</p>
                    </div>
                    <div class="cv-metric-icon gold">
                        <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                    </div>
                </div>
                <div class="cv-metric-card">
                    <div>
                        <p class="cv-metric-label">Total Transactions</p>
                        <p class="cv-metric-value" id="statCount">--</p>
                    </div>
                    <div class="cv-metric-icon blue">
                        <svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
                    </div>
                </div>
            </div>

            <!-- TABLE -->
            <div class="cv-card">
                <div class="cv-card-header">
                    <div>
                        <h2>Payment Records</h2>
                        <p id="paymentsCountLabel">0 payments</p>
                    </div>
                    <div class="cv-search-box" style="width:300px;">
                        <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                        <input type="text" id="paymentsSearch" placeholder="Search reference or booking ID...">
                    </div>
                </div>
                <div class="cv-table-wrapper">
                    <table class="cv-table" id="paymentsTable">
                        <thead>
                            <tr>
                                <th>Payment ID</th>
                                <th>Booking Ref</th>
                                <th>Method</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th style="text-align:right;">Reference No.</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td colspan="7" style="text-align:center;padding:20px;">Loading data...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>

    <!-- Shared Utilities -->
    <script src="assets/js/shared/api.js"></script>
    <script src="assets/js/shared/toast.js"></script>
    <script src="assets/js/shared/utils.js"></script>
    
    <!-- Page Script -->
    <script src="assets/js/user/payments.js"></script>
</body>
</html>
