/**
 * CHT Travel - Packages Script
 */
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('packagesGrid');
    const searchInput = document.getElementById('packagesSearch');
    const loadingMessage = document.getElementById('loadingMessage');

    let allPackages = [];

    // Load Data
    async function loadPackages(query = '') {
        try {
            const data = await api.get('packages_list', { q: query });
            if (data.success) {
                allPackages = data.packages || [];
                renderGrid();
            }
        } catch (err) {
            console.error(err);
            Toast.error('Failed to load tour packages');
        } finally {
            if (loadingMessage) loadingMessage.style.display = 'none';
        }
    }

    // Render Grid
    function renderGrid() {
        if (!grid) return;

        if (allPackages.length === 0) {
            grid.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;padding:40px;">No packages found.</p>';
            return;
        }

        grid.innerHTML = allPackages.map(pkg => `
            <div class="cv-tour-card">
                <div class="cv-tour-image">
                    <img src="${pkg.image || 'assets/images/placeholder.jpg'}" 
                         alt="${Utils.escapeHtml(pkg.Destination)}"
                         onerror="this.src='https://placehold.co/400x200/e2e8f0/94a3b8?text=${encodeURIComponent(pkg.Destination)}'">
                    <span class="cv-tour-price">${Utils.formatCurrency(pkg.Price)}</span>
                </div>
                <div class="cv-tour-body">
                    <p class="cv-tour-dest">${Utils.escapeHtml(pkg.Destination)}</p>
                    <h3 style="font-size:14px; font-weight:700; color:var(--text-dark); margin-bottom:8px; line-height:1.3;">
                        ${Utils.escapeHtml(pkg.Name)}
                    </h3>
                    <p style="font-size:13px; color:var(--text-body); margin-bottom:12px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
                        ${Utils.escapeHtml(pkg.Description || 'No description provided.')}
                    </p>
                    <div class="cv-tour-detail">
                        <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                        <strong>${pkg.Duration} Days</strong>
                    </div>
                    <div class="cv-tour-detail" style="margin-bottom:12px;">
                        <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                        Up to ${pkg.MaxPax} pax
                    </div>

                    <div class="cv-tour-inclusions" style="display:flex; flex-wrap:wrap; gap:6px; margin-top:8px;">
                        ${(pkg.Inclusions || 'Meals,Guide,Transfer').split(',').map(inc => `
                            <span class="cv-feature-badge">
                                <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                                ${Utils.escapeHtml(inc.trim())}
                            </span>
                        `).join('')}
                    </div>
                </div>
                <div class="cv-tour-footer">
                    <button class="cv-btn cv-btn-outline cv-btn-sm" style="width:100%;justify-content:center;" onclick="window.location.href='${BASE_URL}bookings/1?package_id=${pkg.PackageID}'">
                        Book Now
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Search
    if (searchInput) {
        searchInput.addEventListener('input', Utils.debounce((e) => {
            loadPackages(e.target.value);
        }, 300));
    }

    // Init
    loadPackages();
});
