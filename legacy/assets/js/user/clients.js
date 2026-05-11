/**
 * CHT Travel - Clients Script
 */
document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('#clientsTable tbody');
    const countLabel = document.getElementById('clientsCountLabel');
    const searchInput = document.getElementById('clientsSearch');
    const clientForm = document.getElementById('clientForm');
    
    // Modal Init
    Modal.init('clientModal');

    // Data State
    let allClients = [];

    // Load Data
    async function loadClients(query = '') {
        try {
            const data = await api.get('clients_list', { q: query });
            if (data.success) {
                allClients = data.clients || [];
                renderTable();
            }
        } catch (err) {
            console.error(err);
            Toast.error('Failed to load customers');
        }
    }

    // Render Table
    function renderTable() {
        countLabel.textContent = `${allClients.length} customer${allClients.length === 1 ? '' : 's'}`;
        
        if (allClients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-muted);">No customers found.</td></tr>';
            return;
        }

        tbody.innerHTML = allClients.map(c => {
            const typeClass = c.customerType === 'VIP' ? 'cv-badge-ongoing' : 
                             (c.customerType === 'CORPORATE' ? 'cv-badge-confirmed' : 'cv-badge-upcoming');
                             
            return `<tr>
                <td><strong>#${c.clientId}</strong></td>
                <td>${Utils.escapeHtml(c.name)}</td>
                <td>${Utils.escapeHtml(c.email)}</td>
                <td>${Utils.escapeHtml(c.contactNumber || '--')}</td>
                <td><span class="cv-badge ${typeClass}">${Utils.escapeHtml(c.customerType)}</span></td>
                <td>${Utils.formatDate(c.dateRegistered)}</td>
                <td style="text-align:right;">
                    <button class="cv-btn cv-btn-outline cv-btn-sm edit-btn" data-id="${c.clientId}">Edit</button>
                </td>
            </tr>`;
        }).join('');
    }

    // Search
    if (searchInput) {
        searchInput.addEventListener('input', Utils.debounce((e) => {
            loadClients(e.target.value);
        }, 300));
    }

    // Open Add Modal
    document.getElementById('openAddClientModal').addEventListener('click', () => {
        document.getElementById('clientModalTitle').textContent = 'Add New Customer';
        clientForm.reset();
        document.getElementById('clientId').value = '';
        Modal.open('clientModal');
    });

    // Edit Delegation
    tbody.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const id = parseInt(e.target.dataset.id, 10);
            const client = allClients.find(c => parseInt(c.clientId, 10) === id);
            if (client) {
                document.getElementById('clientModalTitle').textContent = 'Edit Customer';
                document.getElementById('clientId').value = client.clientId;
                document.getElementById('clientName').value = client.name;
                document.getElementById('clientEmail').value = client.email;
                document.getElementById('clientContact').value = client.contactNumber || '';
                document.getElementById('clientAddress').value = client.address || '';
                document.getElementById('clientType').value = client.customerType || 'REGULAR';
                Modal.open('clientModal');
            }
        }
    });

    // Form Submit
    clientForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = document.querySelector('button[form="clientForm"]');
        const originalText = btn.textContent;
        btn.textContent = 'Saving...';
        btn.disabled = true;

        const formData = new FormData();
        formData.append('clientId', document.getElementById('clientId').value);
        formData.append('name', document.getElementById('clientName').value);
        formData.append('email', document.getElementById('clientEmail').value);
        formData.append('contactNumber', document.getElementById('clientContact').value);
        formData.append('address', document.getElementById('clientAddress').value);
        formData.append('customerType', document.getElementById('clientType').value);

        try {
            const res = await api.post('clients_save', formData);
            if (res.success) {
                Toast.success(res.message);
                Modal.close('clientModal');
                loadClients(searchInput?.value || '');
            }
        } catch (err) {
            Toast.error(err.message || 'Failed to save customer');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });

    // Init
    loadClients();
});
