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
    <title>CHT Travel - Clients</title>
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
                    <h1 class="cv-page-title">Customers</h1>
                    <p class="cv-page-subtitle">Manage client records and contact information</p>
                </div>
                <button class="cv-btn cv-btn-primary" id="openAddClientModal">
                    <svg viewBox="0 0 24 24"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    Add Customer
                </button>
            </div>

            <!-- TABLE -->
            <div class="cv-card">
                <div class="cv-card-header">
                    <div>
                        <h2>Customer List</h2>
                        <p id="clientsCountLabel">0 customers</p>
                    </div>
                    <div class="cv-search-box" style="width:250px;">
                        <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                        <input type="text" id="clientsSearch" placeholder="Search customers...">
                    </div>
                </div>
                <div class="cv-table-wrapper">
                    <table class="cv-table" id="clientsTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>Type</th>
                                <th>Registered</th>
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

    <!-- CLIENT MODAL -->
    <div id="clientModal" class="cv-modal-overlay hidden">
        <div class="cv-modal cv-modal-sm">
            <div class="cv-modal-header">
                <h3 id="clientModalTitle">Add New Customer</h3>
            </div>
            <div class="cv-modal-body">
                <form id="clientForm">
                    <input type="hidden" id="clientId">
                    
                    <div class="cv-form-group">
                        <label class="cv-form-label" for="clientName">Full Name <span style="color:var(--red);">*</span></label>
                        <input type="text" id="clientName" class="cv-form-input" required>
                    </div>

                    <div class="cv-form-group">
                        <label class="cv-form-label" for="clientEmail">Email Address <span style="color:var(--red);">*</span></label>
                        <input type="email" id="clientEmail" class="cv-form-input" required>
                    </div>

                    <div class="cv-form-group">
                        <label class="cv-form-label" for="clientContact">Contact Number</label>
                        <input type="text" id="clientContact" class="cv-form-input">
                    </div>

                    <div class="cv-form-group">
                        <label class="cv-form-label" for="clientAddress">Address</label>
                        <input type="text" id="clientAddress" class="cv-form-input">
                    </div>

                    <div class="cv-form-group">
                        <label class="cv-form-label" for="clientType">Customer Type</label>
                        <select id="clientType" class="cv-form-select">
                            <option value="REGULAR">Regular</option>
                            <option value="CORPORATE">Corporate</option>
                            <option value="VIP">VIP</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="cv-modal-footer">
                <button type="button" class="cv-btn cv-btn-outline" data-modal-close>Cancel</button>
                <button type="submit" form="clientForm" class="cv-btn cv-btn-primary">Save Customer</button>
            </div>
        </div>
    </div>

    <!-- Shared Utilities -->
    <script src="assets/js/shared/api.js"></script>
    <script src="assets/js/shared/toast.js"></script>
    <script src="assets/js/shared/modal.js"></script>
    <script src="assets/js/shared/utils.js"></script>
    
    <!-- Page Script -->
    <script src="assets/js/user/clients.js"></script>
</body>
</html>
