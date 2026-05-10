<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
// Ensure $baseUrl is available from the router scope
global $baseUrl;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <base href="<?php echo $baseUrl; ?>" >
    <script>const BASE_URL = "<?php echo $baseUrl; ?>";</script>
    <meta name="csrf-token" content="<?php echo htmlspecialchars($_SESSION['csrf_token'] ?? ''); ?>">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CHT Travel - Transportation</title>
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
                    <h1 class="cv-page-title">Transportation</h1>
                    <p class="cv-page-subtitle">Manage vehicle fleet and transportation options</p>
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
                        <h2>Vehicle Directory</h2>
                        <p id="transportCountLabel">0 vehicles</p>
                    </div>
                    <div class="cv-search-box" style="width:300px;">
                        <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                        <input type="text" id="transportSearch" placeholder="Search by vehicle type or provider...">
                    </div>
                </div>
            <!-- VEHICLE GRID -->
            <div id="transportGrid" class="cv-vehicle-grid">
                <!-- Data will be loaded here via JS -->
                <div style="grid-column:1/-1; text-align:center; padding:60px; color:var(--text-muted);">
                    <div class="cv-spinner" style="margin-bottom:10px;"></div>
                    Loading vehicles...
                </div>
            </div>
            </div>
        </div>
    </main>

    <!-- Shared Utilities -->
    <script src="assets/js/shared/api.js"></script>
    <script src="assets/js/shared/toast.js"></script>
    <script src="assets/js/shared/utils.js"></script>
    
    <!-- Page Script -->
    <script src="assets/js/user/transport.js"></script>
</body>
</html>
