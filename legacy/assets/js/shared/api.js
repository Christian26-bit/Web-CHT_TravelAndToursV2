/**
 * CHT Travel – Shared API Helper
 * Centralized fetch wrapper with error handling
 */
const api = {
    /**
     * GET request to API endpoint
     * @param {string} endpoint - Path after 'api/' (e.g., 'bookings_list')
     * @param {Object} params - Query parameters
     */
    async get(endpoint, params = {}) {
        const url = new URL(BASE_URL + 'api/' + endpoint, window.location.origin);
        Object.entries(params).forEach(([k, v]) => {
            if (v !== null && v !== undefined && v !== '') {
                url.searchParams.set(k, v);
            }
        });
        
        const res = await fetch(url.toString(), {
            headers: { 'Accept': 'application/json' }
        });
        
        if (res.status === 401) {
            window.location.href = BASE_URL + 'login';
            throw new Error('Session expired');
        }
        
        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
            throw new Error(err.error || `HTTP ${res.status}`);
        }
        
        return res.json();
    },

    /**
     * POST request with FormData or JSON
     * @param {string} endpoint 
     * @param {Object|FormData} data 
     */
    async post(endpoint, data = {}) {
        const isFormData = data instanceof FormData;
        const body = isFormData ? data : new URLSearchParams(data);
        
        const headers = { 'Accept': 'application/json' };
        if (!isFormData) {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        // Add CSRF token
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
        if (csrfToken) {
            headers['X-CSRF-TOKEN'] = csrfToken;
        }
        
        const res = await fetch(BASE_URL + 'api/' + endpoint, {
            method: 'POST',
            headers,
            body,
        });
        
        if (res.status === 401) {
            window.location.href = BASE_URL + 'login';
            throw new Error('Session expired');
        }
        
        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
            throw new Error(err.error || `HTTP ${res.status}`);
        }
        
        return res.json();
    },

    /**
     * DELETE request (via POST with _method override)
     */
    async delete(endpoint, data = {}) {
        data._method = 'DELETE';
        return this.post(endpoint, data);
    }
};
