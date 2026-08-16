const API_BASE_URL = 'http://localhost:8000/api';

// Servicio de inscripciones a eventos -- Cristina Pihuave
export const registrationService = {
  // 1. Inscribir a un participante en un evento
  register: async (eventId, participant) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(participant),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al registrar la participación.');
    }

    return data;
  },

  // 2. Cancelar una inscripción
  cancel: async (eventId, registrationId) => {
    const response = await fetch(
      `${API_BASE_URL}/events/${eventId}/registrations/${registrationId}`,
      {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al cancelar la participación.');
    }

    return data;
  },

  // 3. Consultar los participantes inscritos en un evento
  getByEvent: async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/registrations`, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) throw new Error('Error al consultar los participantes.');
    return await response.json();
  },

  // 4. Consultar las inscripciones de un participante por su correo
  getByParticipant: async (email) => {
    const response = await fetch(
      `${API_BASE_URL}/registrations?email=${encodeURIComponent(email)}`,
      { headers: { 'Accept': 'application/json' } }
    );

    if (!response.ok) throw new Error('Error al consultar tus inscripciones.');
    const data = await response.json();
    return data.registrations;
  },
};
