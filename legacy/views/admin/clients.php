<!DOCTYPE html>
<html lang="en">
<head>
    <base href="<?php echo $baseUrl; ?>">
    <script>const BASE_URL = "<?php echo $baseUrl; ?>";</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CHT Travel & Tour Management System - Customers</title>
    <link rel="stylesheet" href="assets/css/customer-view.css?v=1.1">
    <style>
        /* Specific page overrides to preserve form styling */
        .cv-actions-row {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
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
        .cv-search-wrapper svg {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            fill: var(--text-muted);
            width: 18px;
            height: 18px;
        }
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
        .cv-btn-icon.danger {
            color: var(--danger-color);
            border-color: #fca5a5;
        }

        /* Modal Area */
        .modal-overlay {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0; top: 0; width: 100vw; height: 100vh;
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(4px);
            justify-content: center;
            align-items: center;
        }
        .modal-overlay.show, .modal-overlay:not(.hidden) {
            display: flex;
        }
        .modal-overlay.hidden {
            display: none !important;
        }
        .modal {
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
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        .modal-header h3 {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-dark);
            margin: 0;
        }
        .modal-close-btn {
            background: none;
            border: none;
            font-size: 20px;
            color: var(--text-muted);
            cursor: pointer;
        }
        .modal-subtitle {
            font-size: 13px;
            color: var(--text-muted);
            margin-bottom: 20px;
        }
        .form-group {
            margin-bottom: 16px;
        }
        .form-group label {
            display: block;
            margin-bottom: 6px;
            font-size: 13px;
            font-weight: 500;
            color: var(--text-light);
        }
        .form-group input, .form-group select {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            font-size: 14px;
            outline: none;
            font-family: inherit;
        }
        .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid var(--border-color);
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
            <a href="admin/bookings" class="cv-nav-item">
                <span class="cv-nav-icon"><svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V8h14v11z"/></svg></span>
                Bookings
            </a>
            <a href="admin/tour_packages" class="cv-nav-item">
                <span class="cv-nav-icon"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1a2 2 0 002 2v1.93zm6.9-2.54A1.99 1.99 0 0016 16h-1v-3a1 1 0 00-1-1H8v-2h2a1 1 0 001-1V7h2a2 2 0 002-2v-.41A7.99 7.99 0 0120 12c0 2.08-.8 3.97-2.1 5.39z"/></svg></span>
                Tour Packages
            </a>
            <a href="admin/clients" class="cv-nav-item active">
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
                <div class="cv-user-avatar" id="userInitials">AD</div>
            </div>
        </div>

        <div class="cv-main">
            <div class="cv-section-header">
                <h1 class="cv-page-title">Customers</h1>
                <p class="cv-page-subtitle">Manage your client records and contact information.</p>
            </div>

            <div class="cv-actions-row">
                <div class="cv-search-wrapper">
                    <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                    <input type="text" id="clientsSearch" placeholder="Search clients by name, email, or contact...">
                </div>
                
                <div style="margin-left:auto; display:flex;">
                    <button class="cv-btn cv-btn-primary" id="addClientBtn">
                        <svg viewBox="0 0 24 24" style="width:16px;height:16px;margin-right:6px;fill:none;stroke:currentColor;stroke-width:2;"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
                        Add New Client
                    </button>
                </div>
            </div>

            <!-- TABLE SECTION -->
            <div class="cv-card">
                <div class="cv-table-wrapper">
                    <table class="cv-table" id="clientsTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>Address</th>
                                <th>Type</th>
                                <th>Registered</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Rows rendered by JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- ADD / EDIT CLIENT MODAL -->
    <div id="clientModalOverlay" class="modal-overlay hidden">
        <div class="modal">
            <div class="modal-header">
                <h3 id="clientModalTitle">Add New Client</h3>
                <button class="modal-close-btn" id="closeClientModalBtn">✕</button>
            </div>
            <p class="modal-subtitle">Enter client details below.</p>

            <form id="clientForm">
                <input type="hidden" id="clientId">

                <div class="form-group">
                    <label for="clientName">Name</label>
                    <input type="text" id="clientName" required>
                </div>

                <div class="form-group">
                    <label for="clientEmail">Email</label>
                    <input type="email" id="clientEmail">
                </div>

                <div class="form-group">
                    <label for="clientContact">Contact</label>
                    <input type="text" id="clientContact">
                </div>

                <div class="form-group">
                    <label for="clientAddress">Address</label>
                    <input type="text" id="clientAddress">
                </div>

                <div class="form-group">
                    <label for="clientType">Type</label>
                    <select id="clientType">
                        <option value="REGULAR">REGULAR</option>
                        <option value="CORPORATE">CORPORATE</option>
                        <option value="VIP">VIP</option>
                    </select>
                </div>

                <div class="modal-actions">
                    <button type="button" class="cv-btn cv-btn-outline" id="cancelClientBtn">Cancel</button>
                    <button type="submit" class="cv-btn cv-btn-primary">Save</button>
                </div>
            </form>
        </div>
    </div>

    <script src="assets/js/user/userClients.js"></script>
    <script>
        const username = localStorage.getItem('cht_current_username') || 'Admin';
        const initials = username.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        document.getElementById('userInitials').textContent = initials;

        document.getElementById('userLogoutBtn').addEventListener('click', function() {
            localStorage.removeItem('cht_current_username');
            window.location.href = BASE_URL + 'login';
        });

        // MutationObserver to convert JS emojis in table to SVGs
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if(mutation.target.id === 'clientsTable' || mutation.target.tagName === 'TBODY') {
                    document.querySelectorAll('.btn-edit').forEach(b => {
                        if(b.innerHTML.includes('✏️')) {
                            b.className = "cv-btn-icon btn-action btn-edit";
                            b.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>';
                        }
                    });
                    document.querySelectorAll('.status-badge').forEach(b => {
                        if(!b.classList.contains('cv-badge')) {
                            const txt = b.textContent.trim().toLowerCase();
                            let bClass = 'cv-badge-ongoing'; // default gray
                            if(txt === 'vip') bClass = 'cv-badge-confirmed';
                            if(txt === 'corporate') bClass = 'cv-badge-pending';
                            b.outerHTML = `<span class="cv-badge ${bClass}">${b.textContent}</span>`;
                        }
                    });
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    </script>
</body>
</html>
