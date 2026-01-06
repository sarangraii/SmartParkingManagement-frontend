import axios from 'axios';

// const API_URL = 'http://localhost:5000/api';
const API_URL = process.env.REACT_APP_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const getProfile = () => api.get('/auth/profile');

// Parking Spot APIs
export const getAllSpots = (params) => api.get('/parking-spots', { params });
export const getAvailableSpots = () => api.get('/parking-spots/available');
export const getSpotById = (id) => api.get(`/parking-spots/${id}`);
export const createSpot = (spotData) => api.post('/parking-spots', spotData);
export const updateSpot = (id, spotData) => api.put(`/parking-spots/${id}`, spotData);
export const deleteSpot = (id) => api.delete(`/parking-spots/${id}`);

// Booking APIs
export const createBooking = (bookingData) => api.post('/bookings', bookingData);
export const getUserBookings = () => api.get('/bookings/my-bookings');
export const getAllBookings = () => api.get('/bookings');
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const updateBooking = (id, bookingData) => api.put(`/bookings/${id}`, bookingData);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);
export const checkIn = (id) => api.put(`/bookings/${id}/checkin`);
export const checkOut = (id) => api.put(`/bookings/${id}/checkout`);


export default api;