/**
 * CHT Travel - Trips Script
 */
document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('#tripsTable tbody');
    const searchInput = document.getElementById('tripsSearch');
    const countLabel = document.getElementById('tripsCountLabel');

    let allTrips = [];

    // Load Data
    async function loadTrips(query = '') {
        try {
            const data = await api.get('trips_list', { q: query });
            if (data.success) {
                allTrips = data.trips || [];
                renderTable(query);
            }
        } catch (err) {
            console.error(err);
            Toast.error('Failed to load trips');
        }
    }

    // Render Table
    function renderTable(query = '') {
        if (!tbody) return;

        let filtered = allTrips;
        if (query) {
            const q = query.toLowerCase();
            filtered = allTrips.filter(t => 
                (t.TripName || '').toLowerCase().includes(q) ||
                (t.Location || '').toLowerCase().includes(q)
            );
        }

        if (countLabel) {
            countLabel.textContent = `${filtered.length} trip${filtered.length === 1 ? '' : 's'}`;
        }

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-muted);">No trips found.</td></tr>';
            return;
        }

        tbody.innerHTML = filtered.map(t => {
            const statusClass = (t.Status || 'Active').toLowerCase() === 'active' 
                ? 'cv-badge-completed' 
                : 'cv-badge-cancelled';

            return `<tr>
                <td><strong>#${t.TripID}</strong></td>
                <td><div style="font-weight:600">${Utils.escapeHtml(t.TripName)}</div></td>
                <td>${Utils.escapeHtml(t.Location || '--')}</td>
                <td><div style="max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${Utils.escapeHtml(t.Description || '')}">${Utils.escapeHtml(t.Description || '--')}</div></td>
                <td>${Utils.formatDate(t.StartDate)}</td>
                <td>${Utils.formatDate(t.EndDate)}</td>
                <td style="text-align:right;">
                    <span class="cv-badge ${statusClass}">${Utils.escapeHtml(t.Status || 'Active')}</span>
                </td>
            </tr>`;
        }).join('');
    }

    // Search
    if (searchInput) {
        searchInput.addEventListener('input', Utils.debounce((e) => {
            renderTable(e.target.value);
        }, 300));
    }

    // Init
    loadTrips();
});
