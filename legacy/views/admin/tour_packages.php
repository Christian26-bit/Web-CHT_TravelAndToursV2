<!DOCTYPE html>
<html lang="en">
<head>
    <base href="<?php echo $baseUrl; ?>">
    <script>const BASE_URL = "<?php echo $baseUrl; ?>";</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CHT Travel & Tour Management System - Tour Packages</title>
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

        /* Form Area */
        .package-form-section {
            background: var(--bg-white);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-lg);
            margin-top: 24px;
            box-shadow: 0 1px 3px rgba(15,23,42,0.06);
            overflow: hidden;
        }
        .package-form-header {
            padding: 16px 20px;
            background: #f8fafc;
            border-bottom: 1px solid var(--border-color);
        }
        .accordion-title {
            background: none;
            border: none;
            font-size: 16px;
            font-weight: 600;
            color: var(--text-dark);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .package-form-body {
            padding: 24px;
            display: none;
        }
        .package-form-body.active {
            display: block;
        }
        .package-form-grid {
            display: grid;
            grid-template-columns: 280px 1fr;
            gap: 32px;
        }
        .package-image-area {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .image-drop {
            border: 2px dashed #cbd5e1;
            border-radius: var(--radius-lg);
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            background: #f8fafc;
            overflow: hidden;
            position: relative;
        }
        .image-preview {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: var(--text-muted);
            font-size: 13px;
        }
        .image-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .package-fields .row-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }
        .package-fields .row-4 {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
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
        .form-group input, .form-group textarea {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            font-size: 14px;
            outline: none;
            font-family: inherit;
        }
        .form-group textarea {
            resize: vertical;
        }
        .form-actions-right {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid var(--border-color);
        }
        .checkbox-inline {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            height: 40px;
        }
        @media (max-width: 900px) {
            .package-form-grid { grid-template-columns: 1fr; }
            .package-fields .row-4 { grid-template-columns: 1fr 1fr; }
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
            <a href="admin/tour_packages" class="cv-nav-item active">
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
            <button class="cv-logout-btn" id="logoutBtnPackages">
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
                <h1 class="cv-page-title">Tour Package Management</h1>
                <p class="cv-page-subtitle">Manage all the tour packages offered by CHT Travel & Tours.</p>
            </div>

            <div class="cv-actions-row">
                <div class="cv-search-wrapper">
                    <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                    <input type="text" id="packageSearch" placeholder="Search packages...">
                </div>
                <!-- We hide this search btn since JS might trigger on input or click, keeping ID for compatibility -->
                <button class="cv-btn cv-btn-secondary" id="searchPackagesBtn" style="display:none;">Search</button>
                <div style="margin-left:auto; display:flex; gap:12px;">
                    <button class="cv-btn cv-btn-outline" id="refreshPackagesBtn">
                        <svg viewBox="0 0 24 24" style="width:16px;height:16px;margin-right:6px;fill:currentColor;"><path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
                        Refresh
                    </button>
                    <button class="cv-btn cv-btn-primary" id="scrollToFormBtn">
                        <svg viewBox="0 0 24 24" style="width:16px;height:16px;margin-right:6px;fill:currentColor;"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                        Add New Package
                    </button>
                </div>
            </div>

            <!-- TABLE SECTION -->
            <div class="cv-card" id="packagesTableWrapper">
                <div class="cv-table-wrapper">
                    <table class="cv-table" id="packagesTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Destination</th>
                                <th>Duration</th>
                                <th>Max Pax</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Rows rendered by JS -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- FORM SECTION -->
            <section id="packageFormSection" class="package-form-section">
                <div class="package-form-header">
                    <button type="button" class="accordion-title" id="toggleFormAccordion">
                        <svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:currentColor;"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
                        Add / Edit Tour Package
                    </button>
                </div>

                <div id="packageFormBody" class="package-form-body">
                    <form id="packageForm" class="package-form">
                        <input type="hidden" id="packageId" name="id">

                        <div class="package-form-grid">
                            <!-- LEFT: IMAGE AREA -->
                            <div class="package-image-area">
                                <label style="font-size:13px;font-weight:500;color:var(--text-light);">Package Image</label>
                                <div id="imageDropArea" class="image-drop">
                                    <div id="imagePreview" class="image-preview empty">
                                        <svg viewBox="0 0 24 24" style="width:32px;height:32px;margin-bottom:8px;fill:#cbd5e1;"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
                                        <p>Drag &amp; Drop<br><small>or click to browse</small></p>
                                    </div>
                                    <input type="file" id="packageImageInput" name="image" accept="image/*" hidden>
                                </div>
                                <button type="button" class="cv-btn cv-btn-outline" style="width:100%;" id="browseImageBtn">Browse Files</button>
                            </div>

                            <!-- RIGHT: FIELDS -->
                            <div class="package-fields">
                                <div class="row-2">
                                    <div class="form-group">
                                        <label for="packageName">Package Name</label>
                                        <input id="packageName" name="name" type="text" placeholder="e.g. Island Hopping" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="destination">Destination</label>
                                        <input id="destination" name="destination" type="text" placeholder="e.g. Palawan, PH" required>
                                    </div>
                                </div>

                                <div class="row-4">
                                    <div class="form-group">
                                        <label for="duration">Duration (Days)</label>
                                        <input id="duration" name="duration_days" type="number" min="1" value="4">
                                    </div>
                                    <div class="form-group">
                                        <label for="maxPax">Max Pax</label>
                                        <input id="maxPax" name="max_pax" type="number" min="1" value="20">
                                    </div>
                                    <div class="form-group">
                                        <label for="price">Price (₱)</label>
                                        <input id="price" name="price" type="number" step="0.01" min="0" placeholder="0.00">
                                    </div>
                                    <div class="form-group checkbox-group">
                                        <label>Status</label>
                                        <label class="checkbox-inline">
                                            <input id="status" name="status" type="checkbox" checked> Active
                                        </label>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="description">Description</label>
                                    <textarea id="description" name="description" rows="3" placeholder="Enter package details..."></textarea>
                                </div>

                                <div class="form-group">
                                    <label for="inclusions">Inclusions</label>
                                    <textarea id="inclusions" name="inclusions" rows="2" placeholder="e.g., flights, hotel, breakfast..."></textarea>
                                </div>

                                <div class="form-actions-right">
                                    <button type="button" class="cv-btn cv-btn-outline" id="cancelPackageBtn">Cancel</button>
                                    <button type="submit" class="cv-btn cv-btn-primary" id="savePackageBtn">Save Package</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    </div>

    <script src="assets/js/admin/adminTourPackages.js?v=1.1"></script>
    <script>
        const username = localStorage.getItem('cht_current_username') || 'Admin';
        const initials = username.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        document.getElementById('userInitials').textContent = initials;

        document.getElementById('logoutBtnPackages').addEventListener('click', function() {
            localStorage.removeItem('cht_current_username');
            window.location.href = BASE_URL + 'login';
        });

        // MutationObserver to convert JS emojis in table to SVGs
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if(mutation.target.id === 'packagesTable' || mutation.target.tagName === 'TBODY') {
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
                    document.querySelectorAll('.status-badge').forEach(b => {
                        if(!b.classList.contains('cv-badge')) {
                            b.outerHTML = `<span class="cv-badge ${b.classList.contains('status-active')?'cv-badge-confirmed':'cv-badge-cancelled'}">${b.textContent}</span>`;
                        }
                    });
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    </script>
</body>
</html>
