import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 - refresh token flow
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.data.accessToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ---- AUTH ----
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
};

// ---- HOTELS ----
export const hotelAPI = {
  getAll: (params) => api.get('/hotels', { params }),
  search: (params) => api.get('/hotels/search', { params }),
  getById: (id) => api.get(`/hotels/${id}`),
  create: (data) => api.post('/hotels', data),
  update: (id, data) => api.put(`/hotels/${id}`, data),
  delete: (id) => api.delete(`/hotels/${id}`),
};

// ---- ROOMS ----
export const roomAPI = {
  getByHotel: (hotelId, params) => api.get(`/rooms/hotel/${hotelId}`, { params }),
  getById: (id) => api.get(`/rooms/${id}`),
  getAvailable: (params) => api.get('/rooms/available', { params }),
  search: (params) => api.get('/rooms/search', { params }),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  updateStatus: (id, status) => api.patch(`/rooms/${id}/status`, null, { params: { status } }),
};

// ---- BOOKINGS ----
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getById: (id) => api.get(`/bookings/${id}`),
  getByRef: (ref) => api.get(`/bookings/reference/${ref}`),
  getMyBookings: (params) => api.get('/bookings/my', { params }),
  getAll: (params) => api.get('/bookings', { params }),
  cancel: (id) => api.post(`/bookings/${id}/cancel`),
  confirm: (id) => api.post(`/bookings/${id}/confirm`),
  checkIn: (id) => api.post(`/bookings/${id}/checkin`),
  checkOut: (id) => api.post(`/bookings/${id}/checkout`),
};

// ---- PAYMENTS ----
export const paymentAPI = {
  process: (data) => api.post('/payments', data),
  getByBooking: (bookingId) => api.get(`/payments/booking/${bookingId}`),
};

// ---- REVIEWS ----
export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getByRoom: (roomId) => api.get(`/reviews/room/${roomId}`),
};

// ---- ANALYTICS ----
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
};

// ---- USERS (Admin) ----
export const userAPI = {
  getAll: (params) => api.get('/admin/users', { params }),
  getById: (id) => api.get(`/admin/users/${id}`),
  updateRole: (id, role) => api.patch(`/admin/users/${id}/role`, null, { params: { role } }),
  updateStatus: (id, active) => api.patch(`/admin/users/${id}/status`, null, { params: { active } }),
};

export const profileAPI = {
  get: () => api.get('/profile'),
};

export default api;
