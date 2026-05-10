/**
 * CHT Travel - Transportation Script
 */
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('transportGrid');
    const searchInput = document.getElementById('transportSearch');
    const countLabel = document.getElementById('transportCountLabel');

    let allTransport = [];

    // Load Data
    async function loadTransport(query = '') {
        try {
            const data = await api.get('transportation_list', { q: query });
            if (data.success) {
                allTransport = data.transportation || [];
                renderGrid(query);
            }
        } catch (err) {
            console.error(err);
            Toast.error('Failed to load transportation records');
        }
    }

    // Render Grid
    function renderGrid(query = '') {
        if (!grid) return;

        let filtered = allTransport;
        if (query) {
            const q = query.toLowerCase();
            filtered = allTransport.filter(v => 
                (v.VehicleType || '').toLowerCase().includes(q) ||
                (v.ProviderName || '').toLowerCase().includes(q)
            );
        }

        if (countLabel) {
            countLabel.textContent = `${filtered.length} vehicle${filtered.length === 1 ? '' : 's'}`;
        }

        if (filtered.length === 0) {
            grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted);">No transportation records found.</div>';
            return;
        }

        grid.innerHTML = filtered.map(v => {
            return `
            <div class="cv-vehicle-card">
                <div class="cv-vehicle-header">
                    <div class="cv-vehicle-type">${Utils.escapeHtml(v.VehicleType)}</div>
                    <div class="cv-vehicle-plate">${Utils.escapeHtml(v.PlateNumber || 'N/A')}</div>
                </div>
                
                <div class="cv-vehicle-features">
                    <div class="cv-feature-badge">
                        <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                        ${v.Capacity} Seats
                    </div>
                    <div class="cv-feature-badge">
                        <svg viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
                        GPS
                    </div>
                    <div class="cv-feature-badge">
                        <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                        AC
                    </div>
                </div>

                <div class="cv-vehicle-provider">
                    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"/></svg>
                    ${Utils.escapeHtml(v.ProviderName || 'CHT Fleet')}
                </div>

                <div class="cv-vehicle-footer">
                    <div class="cv-vehicle-price">
                        <small>₱</small>${Utils.formatNumber(v.PricePerDay || 0)}
                        <small>/ day</small>
                    </div>
                    <button class="cv-btn cv-btn-primary cv-btn-sm" onclick="window.location.href='${BASE_URL}bookings/1?vehicle_id=${v.TransportationID}'">
                        Book
                    </button>
                </div>
            </div>`;
        }).join('');
    }

    // Search
    if (searchInput) {
        searchInput.addEventListener('input', Utils.debounce((e) => {
            renderGrid(e.target.value);
        }, 300));
    }

    // Init
    loadTransport();
});
