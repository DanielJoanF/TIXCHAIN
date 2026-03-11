const BASE_URL = 'http://localhost:8080/api';

function getToken() {
    return localStorage.getItem('tixchain_token');
}

async function request(path, options = {}) {
    const token = getToken();
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || 'Request failed');
    }
    return res.json();
}

// Auth
export const walletLogin = (walletAddress) =>
    request('/auth/wallet', {
        method: 'POST',
        body: JSON.stringify({ walletAddress, signature: 'sim_sig_' + Date.now(), message: 'Login to TixChain' }),
    });

// Events
export const fetchEvents = () => request('/events');
export const fetchEvent = (id) => request(`/events/${id}`);

// Tickets
export const mintTicket = (eventId, walletAddress) =>
    request('/tickets/mint', {
        method: 'POST',
        body: JSON.stringify({ eventId, walletAddress, quantity: 1 }),
    });

export const listForResale = (ticketId, price) =>
    request(`/tickets/${ticketId}/resale`, {
        method: 'POST',
        body: JSON.stringify({ price }),
    });

export const buyResale = (ticketId, buyerWalletAddress) =>
    request(`/tickets/${ticketId}/buy`, {
        method: 'POST',
        body: JSON.stringify({ buyerWalletAddress }),
    });

export const fetchQR = (ticketId) => request(`/tickets/${ticketId}/qr`);

// Dashboard
export const fetchDashboard = (promoterId) => request(`/dashboard/promoter?promoterId=${promoterId}`);
