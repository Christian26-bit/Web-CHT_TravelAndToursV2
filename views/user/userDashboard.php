<?php
// Ensure session is started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$userName = htmlspecialchars($_SESSION['name'] ?? 'User');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <base href="<?php echo $baseUrl; ?>">
    <script>const BASE_URL = "<?php echo $baseUrl; ?>";</script>
    <meta name="csrf-token" content="<?php echo htmlspecialchars($_SESSION['csrf_token'] ?? ''); ?>">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CHT Travel & Tour Management - User Dashboard</title>
    <link rel="stylesheet" href="assets/css/customer-view.css?v=1.1">
    <style>
        .welcome-banner {
            background: linear-gradient(135deg, var(--primary) 0%, #1e40af 100%);
            color: white;
            padding: 32px;
            border-radius: var(--radius-lg);
            margin-bottom: 28px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: var(--shadow-sm);
        }
        .welcome-text h1 {
            font-size: 24px;
            margin-bottom: 8px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        .welcome-text p {
            color: rgba(255,255,255,0.85);
            margin: 0;
            font-size: 14px;
        }
        .btn-banner-booking {
            background: white;
            color: var(--primary);
            border: none;
            padding: 12px 24px;
            border-radius: var(--radius-full);
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all var(--transition-fast);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .btn-banner-booking:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.2);
            color: var(--primary-dark);
        }
        
        @media (max-width: 768px) {
            .welcome-banner {
                flex-direction: column;
                text-align: center;
                gap: 20px;
                padding: 24px;
            }
        }
    </style>
</head>
<body class="cv-body">

    <?php include __DIR__ . '/sidebar.php'; ?>

    <!-- MAIN CONTENT -->
    <div class="cv-content">
        <?php include __DIR__ . '/topbar.php'; ?>

        <div class="cv-main">
            <!-- TOP WELCOME BANNER -->
            <section class="welcome-banner">
                <div class="welcome-text">
                    <h1>Welcome back, <span><?php echo $userName; ?></span></h1>
                    <p>Here’s a quick overview of your travel agency performance.</p>
                </div>
                <button class="btn-banner-booking" style="display:flex;align-items:center;gap:6px;" onclick="window.location.href = BASE_URL + 'bookings/1'">
                    <svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:currentColor;"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg> 
                    New Booking
                </button>
            </section>

            <!-- QUICK ACTIONS -->
            <div class="cv-quick-actions">
                <button class="cv-quick-action-btn" onclick="window.location.href = BASE_URL + 'user/clients'">
                    <svg viewBox="0 0 24 24"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    Add Client
                </button>
                <button class="cv-quick-action-btn" onclick="window.location.href = BASE_URL + 'user/payments'">
                    <svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
                    Record Payment
                </button>
            </div>

            <!-- METRIC CARDS -->
            <div class="cv-metrics-grid">
                <div class="cv-metric-card">
                    <div>
                        <p class="cv-metric-label">Total Customers</p>
                        <p class="cv-metric-value" id="totalCustomers">...</p>
                    </div>
                    <div class="cv-metric-icon customers">
                        <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                    </div>
                </div>

                <div class="cv-metric-card">
                    <div>
                        <p class="cv-metric-label">Ongoing Trips</p>
                        <p class="cv-metric-value" id="ongoingTrips">...</p>
                    </div>
                    <div class="cv-metric-icon ongoing">
                        <svg viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011.5 2 1.5 1.5 0 0010 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                    </div>
                </div>

                <div class="cv-metric-card">
                    <div>
                        <p class="cv-metric-label">Upcoming Trips</p>
                        <p class="cv-metric-value" id="upcomingTrips">...</p>
                    </div>
                    <div class="cv-metric-icon upcoming">
                        <svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V8h14v11z"/></svg>
                    </div>
                </div>

                <div class="cv-metric-card">
                    <div>
                        <p class="cv-metric-label">Completed Trips</p>
                        <p class="cv-metric-value" id="completedTrips">...</p>
                    </div>
                    <div class="cv-metric-icon completed">
                        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    </div>
                </div>
            </div>

            <!-- RECENT BOOKINGS TABLE -->
            <div class="cv-card">
                <div class="cv-card-header">
                    <div>
                        <h2>Recent Bookings</h2>
                        <p>Latest activities from your agency</p>
                    </div>
                    <a href="user/bookings" class="cv-link">View All</a>
                </div>
                <div class="cv-table-wrapper">
                    <table class="cv-table" id="userBookingsTable">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Client</th>
                                <th>Destination</th>
                                <th>Package</th>
                                <th>Dates</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td colspan="6" style="text-align:center;padding:20px;">Loading data...</td></tr>
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
    <script src="assets/js/user/dashboard.js?v=1.1"></script>
</body>
</html>
