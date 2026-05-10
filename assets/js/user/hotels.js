/**
 * CHT Travel - Hotels Script
 */
document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('#hotelsTable tbody');
    const searchInput = document.getElementById('hotelsSearch');
    const countLabel = document.getElementById('hotelsCountLabel');

    let allHotels = [];

    // Load Data
    async function loadHotels(query = '') {
        try {
            const data = await api.get('hotels_list', { q: query });
            if (data.success) {
                allHotels = data.hotels || [];
                renderTable(query);
            }
        } catch (err) {
            console.error(err);
            Toast.error('Failed to load accommodations');
        }
    }

    // Render Table
    function renderTable(query = '') {
        if (!tbody) return;

        let filtered = allHotels;
        if (query) {
            const q = query.toLowerCase();
            filtered = allHotels.filter(h => 
                (h.AccommodationName || '').toLowerCase().includes(q) ||
                (h.Address || '').toLowerCase().includes(q)
            );
        }

        if (countLabel) {
            countLabel.textContent = `${filtered.length} accommodation${filtered.length === 1 ? '' : 's'}`;
        }

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-muted);">No accommodations found.</td></tr>';
            return;
        }

        tbody.innerHTML = filtered.map(h => {
            return `<tr>
                <td><strong>#${h.AccommodationID}</strong></td>
                <td><div style="font-weight:600">${Utils.escapeHtml(h.AccommodationName)}</div></td>
                <td>${Utils.escapeHtml(h.Address || '--')}</td>
                <td>${Utils.escapeHtml(h.ContactNumber || '--')}</td>
                <td><span class="cv-badge cv-badge-upcoming">${Utils.escapeHtml(h.RoomType || 'Standard')}</span></td>
                <td>${h.AvailableRooms} rooms</td>
                <td><div style="max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${Utils.escapeHtml(h.Amenities || '')}">${Utils.escapeHtml(h.Amenities || '--')}</div></td>
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
    loadHotels();
});
