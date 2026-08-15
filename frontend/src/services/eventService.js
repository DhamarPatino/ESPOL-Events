const API_BASE_URL = 'http://localhost:8000/api';

export const eventService = {
  // 1. Obtener eventos con soporte para búsqueda y filtrado
    getEvents: async (filters = {}) => {
    // Construir query string dinámicamente (?search=x&category=y&...)
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
    return data.events; // Retornamos el array de eventos de la respuesta
    },

  // 2. Crear un nuevo evento
    createEvent: async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        },
        body: JSON.stringify(eventData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Si la validación de Laravel (422) o algún otro error ocurre
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
};