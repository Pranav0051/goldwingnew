import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://motivated-trust-production-8b10.up.railway.app/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add JWT token to every request automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401 errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const isAuthPath = error.config?.url?.includes('/auth/');
            if (!isAuthPath) {
                console.warn("Unauthorized access - clearing stale session");
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('isAdminLoggedIn');
                localStorage.removeItem('isStaffLoggedIn');
                localStorage.removeItem('isPilotLoggedIn');
                localStorage.removeItem('isAgentLoggedIn');
                if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                    window.location.href = '/login?error=Session expired';
                }
            }
        }
        return Promise.reject(error);
    }
);

// Auth Services
export const authService = {
    login: async (username, password) => {
        const response = await api.post('/auth/signin', { username, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },
    signup: async (userData) => {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('isStaffLoggedIn');
        localStorage.removeItem('isPilotLoggedIn');
        localStorage.removeItem('isAgentLoggedIn');
    },
    getUserProfile: async () => {
        try {
            const response = await api.get('/GUser/me');
            return response.data;
        } catch (err) {
            console.warn('Could not fetch user profile:', err.message);
            return null;
        }
    }
};

// Booking Services
export const bookingService = {
    createBooking: async (bookingData) => {
        const response = await api.post('/bookings/create', bookingData);
        return response.data;
    },
    verifyPayment: async (paymentData) => {
        const response = await api.post('/bookings/verify-payment', paymentData);
        return response.data;
    },
    getMyBookings: async () => {
        const response = await api.get('/bookings/my');
        return response.data;
    },
    getAllBookings: async () => {
        const response = await api.get('/bookings/all');
        return response.data;
    },
    getBookingsByAgent: async (agentId) => {
        const response = await api.get(`/bookings/agent/${agentId}`);
        return response.data;
    },
    getBooking: async (id) => {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
    },
    updateStatus: async (id, status) => {
        const response = await api.put(`/bookings/${id}/status`, null, { params: { status } });
        return response.data;
    },
    deleteBooking: async (id) => {
        const response = await api.delete(`/bookings/${id}`);
        return response.data;
    }
};

// Slot Services
export const slotService = {
    getAllSlots: async () => {
        const response = await api.get('/slots');
        return response.data;
    },
    getAvailability: async (date) => {
        const response = await api.get('/slots/availability', { params: { date } });
        return response.data;
    },
    addOrUpdateSlot: async (slotData) => {
        const response = await api.post('/slots', slotData);
        return response.data;
    },
    deleteSlot: async (id) => {
        const response = await api.delete(`/slots/${id}`);
        return response.data;
    }
};

export default api;
