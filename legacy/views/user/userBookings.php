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
    <title>CHT Travel - Bookings</title>
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
                    <h1 class="cv-page-title">Bookings</h1>
                    <p class="cv-page-subtitle">Manage all travel bookings and reservations</p>
                </div>
                <button class="cv-btn cv-btn-primary" onclick="window.location.href = BASE_URL + 'bookings/1'">
                    <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                    New Booking
                </button>
            </div>

            <!-- STATS CARDS -->
            <div class="cv-metrics-grid" style="grid-template-columns: repeat(3, 1fr);">
                <div class="cv-metric-card">
                    <div>
                        <p class="cv-metric-label">Total Bookings</p>
                        <p class="cv-metric-value" id="statTotal">--</p>
                    </div>
                    <div class="cv-metric-icon blue">
                        <svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V8h14v11z"/></svg>
                    </div>
                </div>
                <div class="cv-metric-card">
                    <div>
                        <p class="cv-metric-label">Confirmed</p>
                        <p class="cv-metric-value" id="statConfirmed">--</p>
                    </div>
                    <div class="cv-metric-icon green">
                        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    </div>
                </div>
                <div class="cv-metric-card">
                    <div>
                        <p class="cv-metric-label">Pending</p>
                        <p class="cv-metric-value" id="statPending">--</p>
                    </div>
                    <div class="cv-metric-icon gold">
                        <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                    </div>
                </div>
            </div>

            <!-- TABLE -->
            <div class="cv-card">
                <div class="cv-card-header">
                    <div>
                        <h2>Booking Records</h2>
                        <p id="bookingsCountLabel">0 booking(s)</p>
                    </div>
                    <div class="cv-search-box" style="width:300px;">
                        <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                        <input type="text" id="bookingsSearch" placeholder="Search by customer, package...">
                    </div>
                </div>
                <div class="cv-table-wrapper">
                    <table class="cv-table" id="bookingsTable">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Customer</th>
                                <th>Package</th>
                                <th>Booking Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th style="text-align:right;">Actions</th>
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

    <!-- UPDATE STATUS MODAL -->
    <div id="statusModal" class="cv-modal-overlay hidden">
        <div class="cv-modal cv-modal-sm">
            <div class="cv-modal-header">
                <h3>Update Booking Status</h3>
            </div>
            <div class="cv-modal-body">
                <form id="statusForm">
                    <input type="hidden" id="statusBookingId">
                    <div class="cv-form-group">
                        <label class="cv-form-label">Booking Reference</label>
                        <input type="text" id="statusBookingRef" class="cv-form-input" disabled>
                    </div>
                    <div class="cv-form-group">
                        <label class="cv-form-label" for="bookingStatus">Status</label>
                        <select id="bookingStatus" class="cv-form-select">
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="cv-modal-footer">
                <button type="button" class="cv-btn cv-btn-outline" data-modal-close>Cancel</button>
                <button type="submit" form="statusForm" class="cv-btn cv-btn-primary">Update Status</button>
            </div>
        </div>
    </div>

    <!-- Shared Utilities -->
    <script src="assets/js/shared/api.js"></script>
    <script src="assets/js/shared/toast.js"></script>
    <script src="assets/js/shared/modal.js"></script>
    <script src="assets/js/shared/utils.js"></script>
    
    <!-- Page Script -->
    <script src="assets/js/user/bookings.js"></script>
</body>
</html>
