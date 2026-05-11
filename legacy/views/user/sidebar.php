<?php
// Determine active page
$currentPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$isDashboard = strpos($currentPath, 'user/dashboard') !== false;
$isBookings = strpos($currentPath, 'user/bookings') !== false;
$isClients = strpos($currentPath, 'user/clients') !== false;
$isPackages = strpos($currentPath, 'user/tour_packages') !== false;
$isTrips = strpos($currentPath, 'user/trips') !== false;
$isHotel = strpos($currentPath, 'user/hotel') !== false;
$isTransport = strpos($currentPath, 'user/transportation') !== false;
$isPayments = strpos($currentPath, 'user/payments') !== false;
?>
<aside class="cv-sidebar">
    <div class="cv-sidebar-brand">
        <div class="cv-brand-icon">
            <svg viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011.5 2 1.5 1.5 0 0010 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
        </div>
        <div class="cv-brand-text">
            <span>TravelHub</span>
            <small>Employee Panel</small>
        </div>
    </div>

    <div style="padding: 16px 20px; border-bottom: 1px solid var(--border); margin-bottom: 12px;">
        <button class="cv-btn cv-btn-primary" style="width:100%; justify-content:center; gap:8px;" onclick="window.location.href = BASE_URL + 'bookings/1'">
            <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            New Booking
        </button>
    </div>

    <nav class="cv-sidebar-nav">
        <a href="user/dashboard" class="cv-nav-item <?php echo $isDashboard ? 'active' : ''; ?>">
            <span class="cv-nav-icon"><svg viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg></span>
            Dashboard
        </a>
        <a href="user/bookings" class="cv-nav-item <?php echo $isBookings ? 'active' : ''; ?>">
            <span class="cv-nav-icon"><svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V8h14v11z"/></svg></span>
            Bookings
        </a>
        <a href="user/clients" class="cv-nav-item <?php echo $isClients ? 'active' : ''; ?>">
            <span class="cv-nav-icon"><svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg></span>
            Clients
        </a>
        <a href="user/tour_packages" class="cv-nav-item <?php echo $isPackages ? 'active' : ''; ?>">
            <span class="cv-nav-icon"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1a2 2 0 002 2v1.93zm6.9-2.54A1.99 1.99 0 0016 16h-1v-3a1 1 0 00-1-1H8v-2h2a1 1 0 001-1V7h2a2 2 0 002-2v-.41A7.99 7.99 0 0120 12c0 2.08-.8 3.97-2.1 5.39z"/></svg></span>
            Tour Packages
        </a>
        <a href="user/trips" class="cv-nav-item <?php echo $isTrips ? 'active' : ''; ?>">
            <span class="cv-nav-icon"><svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg></span>
            Trips
        </a>
        <a href="user/hotel" class="cv-nav-item <?php echo $isHotel ? 'active' : ''; ?>">
            <span class="cv-nav-icon"><svg viewBox="0 0 24 24"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/></svg></span>
            Hotel
        </a>
        <a href="user/transportation" class="cv-nav-item <?php echo $isTransport ? 'active' : ''; ?>">
            <span class="cv-nav-icon"><svg viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg></span>
            Transportation
        </a>
        <a href="user/payments" class="cv-nav-item <?php echo $isPayments ? 'active' : ''; ?>">
            <span class="cv-nav-icon"><svg viewBox="0 0 24 24"><path d="M21 4H3c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h18c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H3v-3h18v3zm0-6H3V6h18v6z"/></svg></span>
            Payments
        </a>
    </nav>

    <div class="cv-sidebar-footer">
        <button class="cv-logout-btn" id="userLogoutBtn">
            <svg viewBox="0 0 24 24"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4a2 2 0 00-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
            Logout
        </button>
    </div>
</aside>
