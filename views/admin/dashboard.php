<?php
// Ensure session is started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$userName = htmlspecialchars($_SESSION['name'] ?? 'Admin');
$nameParts = explode(' ', $userName);
$initials = strtoupper(substr($nameParts[0], 0, 1));
if (count($nameParts) > 1) {
    $initials .= strtoupper(substr($nameParts[1], 0, 1));
} elseif (strlen($userName) > 1) {
    $initials .= strtoupper(substr($userName, 1, 1));
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <base href="<?php echo $baseUrl; ?>">
    <script>const BASE_URL = "<?php echo $baseUrl; ?>";</script>
    <meta name="csrf-token" content="<?php echo htmlspecialchars($_SESSION['csrf_token'] ?? ''); ?>">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CHT Travel & Tour Management System - Admin Dashboard</title>
    <link rel="stylesheet" href="assets/css/customer-view.css?v=1.1">
</head>
<body class="cv-body">

    <!-- SIDEBAR -->
    <aside class="cv-sidebar">
        <div class="cv-sidebar-brand">
            <div class="cv-brand-icon">
                <svg viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011.5 2 1.5 1.5 0 0010 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
            </div>
            <div class="cv-brand-text">
                <span>CHT Travel</span>
                <small>& Tours</small>
            </div>
        </div>

        <nav class="cv-sidebar-nav">
            <a href="admin/dashboard" class="cv-nav-item active">
                <span class="cv-nav-icon"><svg viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg></span>
                Dashboard
            </a>
            <a href="admin/bookings" class="cv-nav-item">
                <span class="cv-nav-icon"><svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V8h14v11z"/></svg></span>
                Bookings
            </a>
            <a href="admin/tour_packages" class="cv-nav-item">
                <span class="cv-nav-icon"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1a2 2 0 002 2v1.93zm6.9-2.54A1.99 1.99 0 0016 16h-1v-3a1 1 0 00-1-1H8v-2h2a1 1 0 001-1V7h2a2 2 0 002-2v-.41A7.99 7.99 0 0120 12c0 2.08-.8 3.97-2.1 5.39z"/></svg></span>
                Tour Packages
            </a>
            <a href="admin/clients" class="cv-nav-item">
                <span class="cv-nav-icon"><svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg></span>
                Customers
            </a>
            <a href="admin/employees" class="cv-nav-item">
                <span class="cv-nav-icon"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2a7.2 7.2 0 01-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 01-6 3.22z"/></svg></span>
                User Roles
            </a>
        </nav>

        <div class="cv-sidebar-footer">
            <button class="cv-logout-btn" id="logoutBtnDash">
                <svg viewBox="0 0 24 24"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4a2 2 0 00-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
                Logout
            </button>
        </div>
    </aside>

    <!-- MAIN CONTENT -->
    <div class="cv-content">
        <!-- TOP BAR -->
        <div class="cv-topbar">
            <div class="cv-search-box">
                <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                <input type="text" placeholder="Search bookings, tours, customers...">
            </div>
            <div class="cv-topbar-right">
                <button class="cv-notif-btn">
                    <svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
                    <span class="cv-notif-badge" id="notifCount">3</span>
                </button>
                <div class="cv-user-avatar" title="<?php echo $userName; ?>">
                    <?php echo $initials; ?>
                </div>
            </div>
        </div>

        <!-- MAIN AREA -->
        <div class="cv-main">
            <!-- HEADER -->
            <div class="cv-section-header">
                <h1 class="cv-page-title">Dashboard Overview</h1>
                <p class="cv-page-subtitle">Welcome back! Here's what's happening today.</p>
            </div>

            <!-- METRIC CARDS -->
            <div class="cv-metrics-grid">
                <div class="cv-metric-card">
                    <div>
                        <p class="cv-metric-label">Total Bookings</p>
                        <p class="cv-metric-value" id="totalBookingsValue">--</p>
                    </div>
                    <div class="cv-metric-icon blue">
                        <svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V8h14v11z"/></svg>
                    </div>
                </div>
                <div class="cv-metric-card">
                    <div>
                        <p class="cv-metric-label">Active Tours</p>
                        <p class="cv-metric-value" id="activeToursValue">--</p>
                    </div>
                    <div class="cv-metric-icon teal">
                        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1a2 2 0 002 2v1.93zm6.9-2.54A1.99 1.99 0 0016 16h-1v-3a1 1 0 00-1-1H8v-2h2a1 1 0 001-1V7h2a2 2 0 002-2v-.41A7.99 7.99 0 0120 12c0 2.08-.8 3.97-2.1 5.39z"/></svg>
                    </div>
                </div>
                <div class="cv-metric-card">
                    <div>
                        <p class="cv-metric-label">Monthly Revenue</p>
                        <p class="cv-metric-value" id="monthlyRevenueValue">--</p>
                    </div>
                    <div class="cv-metric-icon gold">
                        <svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
                    </div>
                </div>
                <div class="cv-metric-card">
                    <div>
                        <p class="cv-metric-label">New Customers</p>
                        <p class="cv-metric-value" id="newCustomersValue">--</p>
                    </div>
                    <div class="cv-metric-icon blue">
                        <svg viewBox="0 0 24 24"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    </div>
                </div>
            </div>

            <!-- UPCOMING TOURS -->
            <div class="cv-section">
                <div class="cv-section-title-row">
                    <div>
                        <h2 class="cv-section-title">Upcoming Tours</h2>
                        <p class="cv-section-subtitle">Popular destinations with available bookings</p>
                    </div>
                    <a href="admin/tour_packages" class="cv-btn cv-btn-outline cv-btn-sm">View All Tours</a>
                </div>
                <div class="cv-tours-grid" id="upcomingToursGrid">
                    <!-- Loaded by JS -->
                </div>
            </div>

            <!-- RECENT BOOKINGS -->
            <div class="cv-card">
                <div class="cv-card-header">
                    <div>
                        <h2>Recent Bookings</h2>
                        <p>Latest booking activities</p>
                    </div>
                    <a href="admin/bookings" class="cv-link">View All</a>
                </div>
                <div class="cv-table-wrapper">
                    <table class="cv-table" id="recentBookingsTable">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Customer</th>
                                <th>Destination</th>
                                <th>Package</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="recentBookingsBody">
                            <!-- Loaded by JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Shared Utilities -->
    <script src="assets/js/shared/api.js?v=1.1"></script>
    <script src="assets/js/shared/utils.js?v=1.1"></script>
    <script src="assets/js/shared/toast.js?v=1.1"></script>

    <!-- Page Specific Script -->
    <script src="assets/js/admin/dashboard.js?v=1.1"></script>
</body>
</html>
