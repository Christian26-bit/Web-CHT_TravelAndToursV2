/**
 * CHT Travel – Reusable Modal Controller
 */
const Modal = {
    /**
     * Open a modal by ID
     */
    open(modalId) {
        const el = document.getElementById(modalId);
        if (!el) return;
        el.classList.remove('hidden');
        el.classList.add('modal-visible');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        setTimeout(() => {
            const input = el.querySelector('input:not([type="hidden"]), select, textarea');
            if (input) input.focus();
        }, 100);
    },

    /**
     * Close a modal by ID
     */
    close(modalId) {
        const el = document.getElementById(modalId);
        if (!el) return;
        el.classList.add('hidden');
        el.classList.remove('modal-visible');
        document.body.style.overflow = '';
    },

    /**
     * Initialize modal close handlers for a modal element
     */
    init(modalId) {
        const el = document.getElementById(modalId);
        if (!el) return;

        // Click outside to close
        el.addEventListener('click', (e) => {
            if (e.target === el) this.close(modalId);
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !el.classList.contains('hidden')) {
                this.close(modalId);
            }
        });

        // Close buttons
        el.querySelectorAll('[data-modal-close]').forEach(btn => {
            btn.addEventListener('click', () => this.close(modalId));
        });
    },

    /**
     * Create a confirmation dialog
     */
    confirm(message, onConfirm, onCancel) {
        const overlay = document.createElement('div');
        overlay.className = 'cv-modal-overlay modal-visible';
        overlay.innerHTML = `
            <div class="cv-modal cv-modal-sm">
                <div class="cv-modal-header">
                    <h3>Confirm Action</h3>
                </div>
                <div class="cv-modal-body">
                    <p style="color:var(--text-body);font-size:14px;">${message}</p>
                </div>
                <div class="cv-modal-footer">
                    <button class="cv-btn cv-btn-outline cv-btn-sm" id="modalCancelBtn">Cancel</button>
                    <button class="cv-btn cv-btn-danger cv-btn-sm" id="modalConfirmBtn">Confirm</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        overlay.querySelector('#modalConfirmBtn').addEventListener('click', () => {
            overlay.remove();
            document.body.style.overflow = '';
            if (onConfirm) onConfirm();
        });

        overlay.querySelector('#modalCancelBtn').addEventListener('click', () => {
            overlay.remove();
            document.body.style.overflow = '';
            if (onCancel) onCancel();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
                document.body.style.overflow = '';
                if (onCancel) onCancel();
            }
        });
    }
};
