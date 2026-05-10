/**
 * CHT Travel – Toast Notification System
 * Non-blocking notifications with auto-dismiss
 */
const Toast = {
    container: null,

    init() {
        if (this.container) return;
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            display: flex; flex-direction: column; gap: 10px;
            pointer-events: none; max-width: 380px;
        `;
        document.body.appendChild(this.container);
    },

    show(message, type = 'info', duration = 4000) {
        this.init();

        const colors = {
            success: { bg: '#dcfce7', border: '#86efac', text: '#166534', icon: '✓' },
            error:   { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b', icon: '✕' },
            warning: { bg: '#fef3c7', border: '#fcd34d', text: '#92400e', icon: '⚠' },
            info:    { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af', icon: 'ℹ' },
        };

        const c = colors[type] || colors.info;

        const toast = document.createElement('div');
        toast.style.cssText = `
            background: ${c.bg}; border: 1px solid ${c.border}; color: ${c.text};
            padding: 14px 20px; border-radius: 12px; font-size: 14px; font-weight: 500;
            font-family: 'Inter', system-ui, sans-serif;
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
            display: flex; align-items: center; gap: 10px;
            pointer-events: auto; cursor: pointer;
            animation: toastSlideIn 0.3s ease-out;
            transition: opacity 0.3s, transform 0.3s;
        `;
        toast.innerHTML = `<span style="font-size:16px;flex-shrink:0;">${c.icon}</span><span>${message}</span>`;
        toast.addEventListener('click', () => this.dismiss(toast));

        this.container.appendChild(toast);

        if (duration > 0) {
            setTimeout(() => this.dismiss(toast), duration);
        }

        return toast;
    },

    dismiss(toast) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    },

    success(msg, dur) { return this.show(msg, 'success', dur); },
    error(msg, dur)   { return this.show(msg, 'error', dur); },
    warning(msg, dur) { return this.show(msg, 'warning', dur); },
    info(msg, dur)    { return this.show(msg, 'info', dur); },
};

// Add animation CSS
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes toastSlideIn {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
    }
`;
document.head.appendChild(toastStyle);
