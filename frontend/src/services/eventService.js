// src/services/eventService.js

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  const headers = { 'Accept': 'application/json' };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

const request = async (url, options = {}) => {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || 'Error al consultar los eventos.');
  }

  return data;
};

export const eventService = {

  getEvents: async (filters = {}) => {
    const queryParams = new URLSearchParams();

    if (filters.search) {
      queryParams.append('search', filters.search);
    }

    if (filters.category) {
      queryParams.append('category', filters.category);
    }

    if (filters.faculty) {
      queryParams.append('faculty', filters.faculty);
    }

    if (filters.date) {
      queryParams.append('date', filters.date);
    }

    // IMPORTANTE:
    // Estos dos filtros eran los que faltaban
    if (filters.status) {
      queryParams.append('status', filters.status);
    }

    if (filters.user_id) {
      queryParams.append('user_id', filters.user_id);
    }

    const queryString = queryParams.toString();

    const url = `${API_BASE_URL}/events${
      queryString ? `?${queryString}` : ''
    }`;

    const data = await request(url, {
      headers: getAuthHeaders(),
    });

    const events = data?.events ?? data?.data?.events ?? data?.data ?? data;
    return Array.isArray(events) ? events : [];
  },

  createEvent: async (eventData) => request(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: getAuthHeaders(eventData instanceof FormData),
    body: eventData instanceof FormData ? eventData : JSON.stringify(eventData),
  }),

  getEventById: async (id) => request(`${API_BASE_URL}/events/${id}`, {
    headers: getAuthHeaders(),
  }),

  updateEvent: async (id, eventData) => request(`${API_BASE_URL}/events/${id}`, {
    method: eventData instanceof FormData ? 'POST' : 'PUT',
    headers: getAuthHeaders(eventData instanceof FormData),
    body: eventData instanceof FormData ? eventData : JSON.stringify(eventData),
  }),

  deleteEvent: async (id) => request(`${API_BASE_URL}/events/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  }),
};