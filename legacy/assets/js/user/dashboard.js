/**
 * CHT Travel – User Dashboard
 * Populates metric cards and recent bookings table
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Metric Elements
    const elCustomers = document.getElementById('totalCustomers');
    const elOngoing = document.getElementById('ongoingTrips');
    const elUpcoming = document.getElementById('upcomingTrips');
    const elCompleted = document.getElementById('completedTrips');
    const tbody = document.querySelector('#userBookingsTable tbody');

    try {
        const data = await api.get('user_dashboard_summary');
        
        if (data.success) {
            // Update Metrics
            if (elCustomers) elCustomers.textContent = data.metrics.totalCustomers.toLocaleString();
            if (elOngoing) elOngoing.textContent = data.metrics.ongoingTrips.toLocaleString();
            if (elUpcoming) elUpcoming.textContent = data.metrics.upcomingTrips.toLocaleString();
            if (elCompleted) elCompleted.textContent = data.metrics.completedTrips.toLocaleString();

            // Update Recent Bookings
            if (tbody) {
                tbody.innerHTML = '';
                if (data.recentBookings && data.recentBookings.length > 0) {
                    data.recentBookings.forEach(b => {
                        const tr = document.createElement('tr');
                        const statusBadge = Utils.statusBadge(b.status);
                        
                        tr.innerHTML = `
                            <td><strong>#${b.id}</strong></td>
                            <td>${Utils.escapeHtml(b.clientName || '--')}</td>
                            <td>${Utils.escapeHtml(b.destination || '--')}</td>
                            <td>${Utils.escapeHtml(b.packageName || '--')}</td>
                            <td style="white-space:nowrap;">${Utils.formatDate(b.startDate)}</td>
                            <td>${statusBadge}</td>
                        `;
                        tbody.appendChild(tr);
                    });
                } else {
                    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--text-muted)">No recent bookings found.</td></tr>';
                }
            }
        }
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        Toast.error('Failed to load dashboard statistics.');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--red)">Error loading data.</td></tr>';
        }
    }
});
