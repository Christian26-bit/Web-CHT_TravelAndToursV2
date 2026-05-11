/**
 * CHT Travel - Bookings Script
 */
document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('#bookingsTable tbody');
    const searchInput = document.getElementById('bookingsSearch');
    
    // Stats
    const statTotal = document.getElementById('statTotal');
    const statConfirmed = document.getElementById('statConfirmed');
    const statPending = document.getElementById('statPending');
    const countLabel = document.getElementById('bookingsCountLabel');

    // Modal
    Modal.init('statusModal');
    const statusForm = document.getElementById('statusForm');

    let allBookings = [];

    // Load Data
    async function loadBookings(query = '') {
        try {
            const data = await api.get('bookings_list', { q: query });
            if (data.success) {
                allBookings = data.bookings || [];
                
                // Update stats
                if (data.stats) {
                    if (statTotal) statTotal.textContent = data.stats.total;
                    if (statConfirmed) statConfirmed.textContent = data.stats.confirmed;
                    if (statPending) statPending.textContent = data.stats.pending;
                }
                
                renderTable();
            }
        } catch (err) {
            console.error(err);
            Toast.error('Failed to load bookings');
        }
    }

    // Render Table
    function renderTable() {
        if (!tbody) return;
        
        if (countLabel) {
            countLabel.textContent = `${allBookings.length} booking${allBookings.length === 1 ? '' : 's'}`;
        }

        if (allBookings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-muted);">No bookings found.</td></tr>';
            return;
        }

        tbody.innerHTML = allBookings.map(b => {
            const isPaid = b.paidAmount >= b.totalAmount && b.totalAmount > 0;
            const balance = b.totalAmount - b.paidAmount;
            
            return `<tr>
                <td><strong>${Utils.escapeHtml(b.ref)}</strong></td>
                <td>
                    <div style="font-weight:600;color:var(--text-dark)">${Utils.escapeHtml(b.clientName)}</div>
                    <div style="font-size:12px;color:var(--text-muted)">${Utils.escapeHtml(b.clientEmail)}</div>
                </td>
                <td>
                    <div style="font-weight:600;color:var(--text-dark)">${Utils.escapeHtml(b.packageName)}</div>
                    <div style="font-size:12px;color:var(--text-muted)">${Utils.escapeHtml(b.destination)}</div>
                </td>
                <td>${Utils.formatDate(b.startDate)}</td>
                <td>
                    <div style="font-weight:600">${Utils.formatCurrency(b.totalAmount)}</div>
                    <div style="font-size:12px;color:${isPaid ? 'var(--green)' : 'var(--orange)'}">
                        ${isPaid ? 'Fully Paid' : 'Bal: ' + Utils.formatCurrency(balance)}
                    </div>
                </td>
                <td>${Utils.statusBadge(b.status)}</td>
                <td style="text-align:right;">
                    <a href="${BASE_URL}api/user/generate_pdf.php?booking_id=${b.id}" target="_blank" class="cv-btn cv-btn-outline cv-btn-sm" style="margin-right: 4px;" title="Download Invoice">
                        <svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:currentColor;"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
                    </a>
                    <button class="cv-btn cv-btn-outline cv-btn-sm edit-status-btn" data-id="${b.id}" data-ref="${b.ref}" data-status="${b.status.toLowerCase()}">
                        Status
                    </button>
                </td>
            </tr>`;
        }).join('');
    }

    // Search
    if (searchInput) {
        searchInput.addEventListener('input', Utils.debounce((e) => {
            loadBookings(e.target.value);
        }, 300));
    }

    // Edit Status
    tbody.addEventListener('click', (e) => {
        const btn = e.target.closest('.edit-status-btn');
        if (btn) {
            document.getElementById('statusBookingId').value = btn.dataset.id;
            document.getElementById('statusBookingRef').value = btn.dataset.ref;
            document.getElementById('bookingStatus').value = btn.dataset.status;
            Modal.open('statusModal');
        }
    });

    // Form Submit
    statusForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = document.querySelector('button[form="statusForm"]');
        const originalText = btn.textContent;
        btn.textContent = 'Updating...';
        btn.disabled = true;

        const id = document.getElementById('statusBookingId').value;
        const status = document.getElementById('bookingStatus').value;

        try {
            const formData = new FormData();
            formData.append('id', id);
            formData.append('status', status);

            const res = await api.post('bookings_update', formData);
            if (res.success) {
                Toast.success('Booking status updated successfully.');
                Modal.close('statusModal');
                loadBookings(searchInput?.value || '');
            }
        } catch (err) {
            Toast.error(err.message || 'Failed to update status.');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });

    // Init
    loadBookings();
});
