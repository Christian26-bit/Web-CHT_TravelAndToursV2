<!DOCTYPE html>
<html lang="en">
<head>
    <base href="<?php echo $baseUrl; ?>">
    <script>const BASE_URL = "<?php echo $baseUrl; ?>";</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CHT Travel & Tour Management System - Admin Bookings</title>
    <link rel="stylesheet" href="assets/css/customer-view.css?v=1.1">
    <style>
        /* Minimal additions for Bookings specific UI over the new design system */
        .cv-search-bar-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
            gap: 16px;
        }
        .cv-search-wrapper {
            flex: 1;
            position: relative;
            max-width: 400px;
        }
        .cv-search-wrapper input {
            width: 100%;
            padding: 10px 16px 10px 40px;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            background: var(--bg-white);
            font-size: 14px;
            outline: none;
            transition: all 0.2s;
        }
        .cv-search-wrapper input:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }
        .cv-search-wrapper svg {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            fill: var(--text-muted);
            width: 18px;
            height: 18px;
        }
        .cv-actions-row {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        /* Modal Styles matching the new theme */
        .cv-modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0; top: 0; width: 100vw; height: 100vh;
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(4px);
            justify-content: center;
            align-items: center;
        }
        .cv-modal-content {
            background: var(--bg-white);
            border-radius: var(--radius-lg);
            padding: 24px;
            width: 100%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            position: relative;
            animation: modalFadeIn 0.2s ease-out forwards;
        }
        @keyframes modalFadeIn {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .cv-modal-close {
            position: absolute;
            right: 20px;
            top: 20px;
            color: var(--text-muted);
            cursor: pointer;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--radius-md);
            transition: background 0.2s;
        }
        .cv-modal-close:hover {
            background: var(--bg-main);
            color: var(--text-dark);
        }
        .cv-modal-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            color: var(--text-dark);
        }
        .cv-form-group {
            margin-bottom: 16px;
        }
        .cv-form-group label {
            display: block;
            margin-bottom: 6px;
            font-size: 13px;
            font-weight: 500;
            color: var(--text-light);
        }
        .cv-form-group input, 
        .cv-form-group select, 
        .cv-form-group textarea {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
            font-family: 'Inter', sans-serif;
        }
        .cv-form-group input:focus, 
        .cv-form-group select:focus, 
        .cv-form-group textarea:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }
        .cv-form-group textarea {
            min-height: 80px;
            resize: vertical;
        }
        
        /* Actions in Table */
        .cv-table-actions {
            display: flex;
            gap: 6px;
        }
        .cv-btn-icon {
            width: 28px;
            height: 28px;
            border-radius: var(--radius-md);
            border: 1px solid var(--border-color);
            background: var(--bg-white);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--text-light);
            transition: all 0.2s;
        }
        .cv-btn-icon:hover {
            background: var(--bg-main);
            color: var(--primary-color);
            border-color: var(--primary-color);
        }
        .cv-btn-icon.danger:hover {
            color: var(--danger-color);
            border-color: var(--danger-color);
            background: #fef2f2;
        }
        .cv-btn-icon svg {
            width: 14px;
            height: 14px;
            fill: currentColor;
        }
    </style>
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
            <a href="admin/dashboard" class="cv-nav-item">
                <span class="cv-nav-icon"><svg viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg></span>
                Dashboard
            </a>
            <a href="admin/bookings" class="cv-nav-item active">
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
            <button class="cv-logout-btn" id="userLogoutBtn">
                <svg viewBox="0 0 24 24"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4a2 2 0 00-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
                Logout
            </button>
        </div>
    </aside>

    <!-- MAIN CONTENT -->
    <div class="cv-content">
        <!-- TOP BAR -->
        <div class="cv-topbar">
            <div></div> <!-- Spacer -->
            <div class="cv-topbar-right">
                <button class="cv-notif-btn">
                    <svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
                </button>
                <div class="cv-user-avatar" id="userInitials">AD</div>
            </div>
        </div>

        <!-- MAIN AREA -->
        <div class="cv-main">
            <!-- HEADER -->
            <div class="cv-section-header">
                <h1 class="cv-page-title">Bookings Management</h1>
                <p class="cv-page-subtitle">Manage all travel bookings, reservations, and updates.</p>
            </div>

            <!-- METRIC CARDS -->
            <div class="cv-metrics-grid">
                <div class="cv-metric-card">
                    <div>
                        <p class="cv-metric-label">Total Bookings</p>
                        <p class="cv-metric-value" id="statTotal">0</p>
                    </div>
                    <div class="cv-metric-icon blue">
                        <svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V8h14v11z"/></svg>
                    </div>
                </div>
                <div class="cv-metric-card">
                    <div>
                        <p class="cv-metric-label">Confirmed Bookings</p>
                        <p class="cv-metric-value" id="statConfirmed">0</p>
                    </div>
                    <div class="cv-metric-icon green">
                        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    </div>
                </div>
                <div class="cv-metric-card">
                    <div>
                        <p class="cv-metric-label">Cancelled Bookings</p>
                        <p class="cv-metric-value" id="statCancelled">0</p>
                    </div>
                    <div class="cv-metric-icon danger">
                        <svg viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>
                    </div>
                </div>
            </div>

            <!-- SEARCH AND ACTIONS -->
            <div class="cv-search-bar-row">
                <div class="cv-search-wrapper">
                    <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                    <input type="text" id="bookingsSearch" placeholder="Search by client, destination, or package...">
                </div>
                <div class="cv-actions-row">
                    <span style="font-size: 13px; color: var(--text-muted); margin-right: 8px;" id="bookingsCountLabel">0 booking(s)</span>
                    <button class="cv-btn cv-btn-primary" id="newBookingBtnTop">
                        <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;margin-right:4px;"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                        New Booking
                    </button>
                </div>
            </div>

            <!-- TABLE -->
            <div class="cv-card">
                <div class="cv-table-wrapper">
                    <table class="cv-table" id="bookingsTable">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Client Details</th>
                                <th>Destination</th>
                                <th>Package</th>
                                <th>Trip Dates</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Loaded by JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Booking Modal -->
    <div id="editBookingModal" class="cv-modal">
        <div class="cv-modal-content">
            <span class="cv-modal-close" id="closeEditModal">
                <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </span>
            <h2 class="cv-modal-title">Edit Booking</h2>
            
            <form id="editBookingForm">
                <input type="hidden" id="editBookingId" name="bookingId">
                
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div class="cv-form-group">
                        <label>Client Name</label>
                        <input type="text" id="editClientName" name="clientName" required>
                    </div>
                    <div class="cv-form-group">
                        <label>Client Email</label>
                        <input type="email" id="editClientEmail" name="clientEmail">
                    </div>
                </div>

                <div class="cv-form-group">
                    <label>Client Contact</label>
                    <input type="text" id="editClientContact" name="clientContact">
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div class="cv-form-group">
                        <label>Destination</label>
                        <select id="editDestination" name="destination"></select>
                    </div>
                    <div class="cv-form-group">
                        <label>Package Name</label>
                        <select id="editPackageName" name="packageName"></select>
                    </div>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
                    <div class="cv-form-group">
                        <label>Booking Date</label>
                        <input type="date" id="editBookingDate" name="bookingDate">
                    </div>
                    <div class="cv-form-group">
                        <label>Pax Count</label>
                        <input type="number" id="editPax" name="pax" min="1">
                    </div>
                    <div class="cv-form-group">
                        <label>Total Amount (PHP)</label>
                        <input type="number" id="editTotalAmount" name="totalAmount" min="0" step="0.01">
                    </div>
                </div>

                <div class="cv-form-group">
                    <label>Status</label>
                    <select id="editStatus" name="status">
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <div class="cv-form-group">
                    <label>Special Requests</label>
                    <textarea id="editSpecialRequests" name="specialRequests" placeholder="Any special needs or requests..."></textarea>
                </div>

                <div class="cv-form-group">
                    <label>Addons (Comma separated)</label>
                    <input type="text" id="editAddons" name="addons" placeholder="e.g. Extra Baggage, Travel Insurance">
                </div>

                <button type="submit" class="cv-btn cv-btn-primary" style="width:100%;">Save Changes</button>
            </form>
        </div>
    </div>

    <!-- We define a small override script before including userBookings.js to map Figma SVG actions -->
    <script>
        // Set user initials
        const username = localStorage.getItem('cht_current_username') || 'Admin';
        const initials = username.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        document.getElementById('userInitials').textContent = initials;
        
        // Override the render method to use SVG icons for action buttons instead of emojis
        // We let userBookings.js attach event listeners to .btn-view, .btn-edit, .btn-delete
        // We will just patch the innerHTML after it mounts if needed, or better, patch userBookings.js string directly or just accept emojis for a moment.
        // Wait, userBookings.js relies on static HTML string rendering. Let's create a mutation observer to replace emojis with SVG icons in the table.
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if(mutation.target.id === 'bookingsTable' || mutation.target.tagName === 'TBODY') {
                    // Replace action buttons HTML
                    document.querySelectorAll('.btn-view').forEach(b => {
                        if(b.innerHTML.includes('👁')) {
                            b.className = "cv-btn-icon btn-action btn-view";
                            b.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>';
                        }
                    });
                    document.querySelectorAll('.btn-edit').forEach(b => {
                        if(b.innerHTML.includes('✏️')) {
                            b.className = "cv-btn-icon btn-action btn-edit";
                            b.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>';
                        }
                    });
                    document.querySelectorAll('.btn-delete').forEach(b => {
                        if(b.innerHTML.includes('🗑️')) {
                            b.className = "cv-btn-icon danger btn-action btn-delete";
                            b.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>';
                        }
                    });
                    // Replace status badge classes
                    document.querySelectorAll('.status-badge').forEach(b => {
                        if(!b.classList.contains('cv-badge')) {
                            let text = b.textContent.trim().toLowerCase();
                            b.className = 'cv-badge cv-badge-' + text;
                        }
                    });
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    </script>
    <script src="assets/js/user/userBookings.js?v=1.1"></script>
</body>
</html>
