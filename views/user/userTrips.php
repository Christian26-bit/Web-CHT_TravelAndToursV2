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
    <title>CHT Travel - Trips</title>
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
                    <h1 class="cv-page-title">Trips</h1>
                    <p class="cv-page-subtitle">View scheduled trips and itineraries</p>
                </div>
                <button class="cv-btn cv-btn-primary" onclick="window.location.href = BASE_URL + 'bookings/1'">
                    <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                    New Booking
                </button>
            </div>

            <!-- TABLE CARD -->
            <div class="cv-card">
                <div class="cv-card-header">
                    <div>
                        <h2>Trip Schedules</h2>
                        <p id="tripsCountLabel">0 trips</p>
                    </div>
                    <div class="cv-search-box" style="width:300px;">
                        <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                        <input type="text" id="tripsSearch" placeholder="Search trips by name or location...">
                    </div>
                </div>
                <div class="cv-table-wrapper">
                    <table class="cv-table" id="tripsTable">
                        <thead>
                            <tr>
                                <th>Trip ID</th>
                                <th>Trip Name</th>
                                <th>Location</th>
                                <th>Description</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th style="text-align:right;">Status</th>
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
    <script src="assets/js/user/trips.js"></script>
</body>
</html>
