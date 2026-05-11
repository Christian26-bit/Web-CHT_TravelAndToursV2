<?php
// Ensure session is started to get user data
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$userName = $_SESSION['name'] ?? 'User';
$nameParts = explode(' ', $userName);
$initials = strtoupper(substr($nameParts[0], 0, 1));
if (count($nameParts) > 1) {
    $initials .= strtoupper(substr($nameParts[1], 0, 1));
} elseif (strlen($userName) > 1) {
    $initials .= strtoupper(substr($userName, 1, 1));
}
?>
<div class="cv-topbar">
    <div class="cv-search-box">
        <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        <input type="text" placeholder="Search...">
    </div>
    <div class="cv-topbar-right">
        <button class="cv-notif-btn">
            <svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
        </button>
        <div class="cv-user-avatar" title="<?php echo htmlspecialchars($userName); ?>">
            <?php echo htmlspecialchars($initials); ?>
        </div>
    </div>
</div>
<script>
    // Logout logic using the new API helper
    const logoutBtn = document.getElementById('userLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function() {
            try {
                await api.post('logout');
                window.location.href = BASE_URL + 'login';
            } catch (error) {
                console.error('Logout failed:', error);
                window.location.href = BASE_URL + 'login';
            }
        });
    }
</script>
