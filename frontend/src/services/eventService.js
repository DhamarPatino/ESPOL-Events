const API_BASE_URL = 'http://localhost:8000/api';

export const eventService = {
  // 1. Obtener eventos con soporte para búsqueda y filtrado
  getEvents: async (filters = {}) => {
    const queryParams = new URLSearchParams();

    if (filters.search) queryParams.append('search', filters.search);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.faculty) queryParams.append('faculty', filters.faculty);
    if (filters.date) queryParams.append('date', filters.date);

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/events${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) throw new Error('Error al consultar los eventos.');
    const data = await response.json();
    return data.events;
  },

  // 2. Crear un nuevo evento (Acepta FormData o JSON plano)
  createEvent: async (eventData) => {
    const isFormData = eventData instanceof FormData;

    const headers = {
      'Accept': 'application/json',
    };

    // Solo definir Content-Type si NO es FormData
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers,
      body: isFormData ? eventData : JSON.stringify(eventData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al registrar el evento.');
    }

    return data;
  },

  // 3. Obtener detalle de un evento por ID
  getEventById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) throw new Error('Evento no encontrado.');
    return await response.json();
  },

  // 4. Actualizar un evento (Agregado)
  updateEvent: async (id, eventData) => {
    const isFormData = eventData instanceof FormData;

    const headers = {
      'Accept': 'application/json',
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    } else if (!eventData.has('_method')) {
      // Laravel requiere _method=PUT al enviar archivos via POST
      eventData.append('_method', 'PUT');
    }

    const url = `${API_BASE_URL}/events/${id}`;
    // Si contiene archivos se envía como POST con _method=PUT
    const method = isFormData ? 'POST' : 'PUT';

    const response = await fetch(url, {
      method,
      headers,
      body: isFormData ? eventData : JSON.stringify(eventData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar el evento.');
    }

    return data;
  },

  // 5. Eliminar evento (Agregado)
  deleteEvent: async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al eliminar el evento.');
    }

    return data;
  },
};