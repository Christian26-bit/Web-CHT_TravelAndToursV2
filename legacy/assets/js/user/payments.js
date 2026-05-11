/**
 * CHT Travel - Payments Script
 */
document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('#paymentsTable tbody');
    const searchInput = document.getElementById('paymentsSearch');
    
    // Stats
    const statReceived = document.getElementById('statReceived');
    const statPending = document.getElementById('statPending');
    const statCount = document.getElementById('statCount');
    const countLabel = document.getElementById('paymentsCountLabel');

    let allPayments = [];

    // Load Data
    async function loadPayments(query = '') {
        try {
            // Note: Since payments_list doesn't support 'q' param on backend yet, we filter on frontend
            const data = await api.get('payments_list');
            if (data.success) {
                allPayments = data.payments || [];
                
                // Calculate Stats
                let received = 0;
                let pending = 0;
                
                allPayments.forEach(p => {
                    const amt = parseFloat(p.amount) || 0;
                    if (p.paymentStatus.toLowerCase() === 'completed' || p.paymentStatus.toLowerCase() === 'confirmed') {
                        received += amt;
                    } else if (p.paymentStatus.toLowerCase() === 'pending') {
                        pending += amt;
                    }
                });

                if (statReceived) statReceived.textContent = Utils.formatCurrency(received);
                if (statPending) statPending.textContent = Utils.formatCurrency(pending);
                if (statCount) statCount.textContent = allPayments.length;

                renderTable(query);
            }
        } catch (err) {
            console.error(err);
            Toast.error('Failed to load payments');
        }
    }

    // Render Table
    function renderTable(query = '') {
        if (!tbody) return;

        let filtered = allPayments;
        if (query) {
            const q = query.toLowerCase();
            filtered = allPayments.filter(p => 
                (p.referenceNumber || '').toLowerCase().includes(q) ||
                (p.bookingId || '').toString().includes(q) ||
                (p.paymentMethod || '').toLowerCase().includes(q)
            );
        }
        
        if (countLabel) {
            countLabel.textContent = `${filtered.length} payment${filtered.length === 1 ? '' : 's'}`;
        }

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-muted);">No payments found.</td></tr>';
            return;
        }

        tbody.innerHTML = filtered.map(p => {
            const status = p.paymentStatus ? p.paymentStatus.toLowerCase() : 'pending';
            let badgeClass = 'cv-badge-pending';
            if (status === 'completed' || status === 'confirmed') badgeClass = 'cv-badge-completed';
            if (status === 'failed' || status === 'cancelled') badgeClass = 'cv-badge-cancelled';
            
            return `<tr>
                <td><strong>PMT-${p.paymentId}</strong></td>
                <td><a href="${BASE_URL}user/bookings" class="cv-link">BK-${String(p.bookingId).padStart(3,'0')}</a></td>
                <td>
                    <div style="font-weight:600">${Utils.escapeHtml(p.paymentMethod)}</div>
                </td>
                <td style="font-weight:600;">${Utils.formatCurrency(p.amount)}</td>
                <td>${Utils.formatDate(p.paymentDate)}</td>
                <td><span class="cv-badge ${badgeClass}">${Utils.escapeHtml(p.paymentStatus)}</span></td>
                <td style="text-align:right; font-family:monospace; color:var(--text-muted);">
                    ${Utils.escapeHtml(p.referenceNumber || '--')}
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
    loadPayments();
});
