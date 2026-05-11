/**
 * CHT Travel – Shared Utility Functions
 */
const Utils = {
    /**
     * Format date string to readable format
     */
    formatDate(iso) {
        if (!iso) return '';
        const d = new Date(iso);
        if (isNaN(d.getTime())) return iso;
        return d.toLocaleDateString('en-US', {
            month: 'short', day: '2-digit', year: 'numeric'
        });
    },

    /**
     * Format currency (PHP Peso)
     */
    formatCurrency(amount) {
        const num = parseFloat(amount || 0);
        return '₱' + num.toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    },

    /**
     * Format compact currency (e.g., ₱228.8K)
     */
    formatCurrencyCompact(amount) {
        const num = parseFloat(amount || 0);
        if (num >= 1000000) return '₱' + (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return '₱' + (num / 1000).toFixed(1) + 'K';
        return '₱' + num.toLocaleString('en-PH', { minimumFractionDigits: 2 });
    },

    /**
     * Generate status badge HTML
     */
    statusBadge(status) {
        const s = (status || '').toLowerCase();
        const map = {
            confirmed:  'cv-badge-confirmed',
            completed:  'cv-badge-completed',
            pending:    'cv-badge-pending',
            upcoming:   'cv-badge-upcoming',
            cancelled:  'cv-badge-cancelled',
            ongoing:    'cv-badge-ongoing',
            active:     'cv-badge-confirmed',
            inactive:   'cv-badge-cancelled',
            paid:       'cv-badge-completed',
            failed:     'cv-badge-cancelled',
            refunded:   'cv-badge-pending',
        };
        const cls = map[s] || 'cv-badge-pending';
        return `<span class="cv-badge ${cls}">${status || '--'}</span>`;
    },

    /**
     * Get user initials from name
     */
    getInitials(name) {
        return (name || 'U')
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    },

    /**
     * Debounce function for search inputs
     */
    debounce(fn, delay = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    },

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },
};
