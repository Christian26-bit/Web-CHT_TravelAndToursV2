/**
 * CHT Travel – Admin Dashboard Script
 */
document.addEventListener('DOMContentLoaded', async () => {
    
    // Elements
    const totalBookingsValue = document.getElementById('totalBookingsValue');
    const activeToursValue = document.getElementById('activeToursValue');
    const newCustomersValue = document.getElementById('newCustomersValue');
    const monthlyRevenueValue = document.getElementById('monthlyRevenueValue');
    const upcomingToursGrid = document.getElementById('upcomingToursGrid');
    const recentBookingsBody = document.getElementById('recentBookingsBody');

    try {
        const data = await api.get('admin/dashboard_summary');

        if (data.success) {
            // Metrics
            if (totalBookingsValue) totalBookingsValue.textContent = data.totalBookings ?? '--';
            if (activeToursValue) activeToursValue.textContent = data.activeTours ?? '--';
            if (newCustomersValue) newCustomersValue.textContent = data.newCustomers ?? '--';
            
            if (monthlyRevenueValue && data.monthlyRevenue !== undefined) {
                monthlyRevenueValue.textContent = Utils.formatCurrencyCompact(data.monthlyRevenue);
            }

            // Upcoming Tours
            if (upcomingToursGrid) {
                if (data.upcomingTours && data.upcomingTours.length > 0) {
                    upcomingToursGrid.innerHTML = data.upcomingTours.map(tour => `
                        <div class="cv-tour-card">
                            <div class="cv-tour-image">
                                <img src="${tour.image || 'assets/images/placeholder.jpg'}" 
                                     alt="${Utils.escapeHtml(tour.destination)}"
                                     onerror="this.src='https://placehold.co/400x200/e2e8f0/94a3b8?text=${encodeURIComponent(tour.destination)}'">
                                <span class="cv-tour-price">${Utils.formatCurrency(tour.price)}</span>
                            </div>
                            <div class="cv-tour-body">
                                <p class="cv-tour-dest">${Utils.escapeHtml(tour.destination)}</p>
                                <div class="cv-tour-detail">
                                    <svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V8h14v11z"/></svg>
                                    ${tour.startDate || '--'} - ${tour.endDate || '--'}
                                </div>
                                <div class="cv-tour-detail">
                                    <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>
                                    ${Utils.escapeHtml(tour.packageName || 'Tour Package')}
                                </div>
                                <div class="cv-tour-detail">
                                    <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                                    ${tour.booked || 0}/${tour.maxPax || 30} Booked
                                </div>
                            </div>
                            <div class="cv-tour-footer">
                                <a href="admin/tour_packages" class="cv-btn cv-btn-primary cv-btn-sm" style="width:100%;justify-content:center;">View Details</a>
                            </div>
                        </div>
                    `).join('');
                } else {
                    upcomingToursGrid.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;padding:40px;">No upcoming tours found.</p>';
                }
            }

            // Recent Bookings
            if (recentBookingsBody) {
                if (data.recentBookings && data.recentBookings.length > 0) {
                    recentBookingsBody.innerHTML = data.recentBookings.map(b => `
                        <tr>
                            <td><strong>BK-${String(b.id).padStart(3,'0')}</strong></td>
                            <td>${Utils.escapeHtml(b.client || '--')}</td>
                            <td>${Utils.escapeHtml(b.destination || '--')}</td>
                            <td>${Utils.escapeHtml(b.package || '--')}</td>
                            <td style="white-space:nowrap;">${b.date || '--'}</td>
                            <td>${Utils.statusBadge(b.status)}</td>
                        </tr>
                    `).join('');
                } else {
                    recentBookingsBody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:24px;">No recent bookings.</td></tr>';
                }
            }
        }
    } catch (error) {
        console.error('Failed to load admin dashboard:', error);
        Toast.error('Failed to load dashboard data.');
    }

    // Logout Handling
    const logoutBtn = document.getElementById('logoutBtnDash');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await api.post('logout');
                window.location.href = BASE_URL + 'login';
            } catch (err) {
                window.location.href = BASE_URL + 'login';
            }
        });
    }
});
