import { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';

// Panel del organizador: edición, eliminación y participantes -- Cristina Pihuave
export default function OrganizerDashboardPage({ setCurrentPage }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Evento cuyo listado de participantes está desplegado
    const [openId, setOpenId] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loadingParticipants, setLoadingParticipants] = useState(false);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await eventService.getEvents();
            setEvents(data);
            setError(null);
        } catch (err) {
            console.error('Error al cargar eventos:', err);
            setError('No se pudieron cargar los eventos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Elimina el evento tras confirmar
    const handleDelete = async (event) => {
        const confirmar = window.confirm(
            `¿Eliminar el evento "${event.title}"? También se eliminarán sus inscripciones.`
        );
        if (!confirmar) return;

        try {
            setDeletingId(event.id);
            setMessage(null);
            const data = await eventService.deleteEvent(event.id);

            setEvents((list) => list.filter((e) => e.id !== event.id));
            setMessage(data.message);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setDeletingId(null);
        }
    };

    // Muestra u oculta los participantes de un evento
    const toggleParticipants = async (eventId) => {
        if (openId === eventId) {
            setOpenId(null);
            return;
        }

        try {
            setOpenId(eventId);
            setLoadingParticipants(true);
            const data = await registrationService.getByEvent(eventId);
            setParticipants(data.registrations);
        } catch (err) {
            setError(err.message);
            setParticipants([]);
        } finally {
            setLoadingParticipants(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <div style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 40px 60px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 26, gap: 16, flexWrap: 'wrap' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>
                            Panel del Organizador
                        </h1>
                        <p style={{ margin: '6px 0 0', fontSize: 13, color: '#7a7a7a' }}>
                            Administra los eventos publicados y consulta sus participantes.
                        </p>
                    </div>
                    <button onClick={() => setCurrentPage('create-event')} style={primaryBtn}>
                        Crear evento
                    </button>
                </div>

                {message && <div style={successStyle}>{message}</div>}
                {error && <div style={errorStyle}>{error}</div>}

                {loading && (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#7a7a7a', fontSize: 14 }}>
                        Cargando eventos...
                    </div>
                )}

                {!loading && events.length === 0 && !error && (
                    <div style={emptyStyle}>
                        <div style={{ fontSize: 32, marginBottom: 12, color: '#9a9a9a' }}>○</div>
                        <p style={{ fontSize: 14, color: '#7a7a7a', margin: '0 0 16px' }}>
                            Todavía no hay eventos publicados.
                        </p>
                        <button onClick={() => setCurrentPage('create-event')} style={secondaryBtn}>
                            Crear el primero
                        </button>
                    </div>
                )}

                {!loading && events.length > 0 && (
                    <div style={{ display: 'grid', gap: 12 }}>
                        {events.map((event) => (
                            <div key={event.id} style={cardStyle}>
                                <div style={{ padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                                    <div style={{ flex: 1, minWidth: 240 }}>
                                        <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>
                                            {event.title}
                                        </h3>
                                        <div style={{ fontSize: 12, color: '#7a7a7a' }}>
                                            {formatDate(event.date)} · {event.location} · {event.faculty}
                                        </div>
                                        <div style={{ fontSize: 12, color: '#9a9a9a', marginTop: 3 }}>
                                            Capacidad: {event.max_participants} participantes
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        <button onClick={() => toggleParticipants(event.id)} style={secondaryBtn}>
                                            {openId === event.id ? 'Ocultar' : 'Participantes'}
                                        </button>
                                        <button onClick={() => setCurrentPage('event-detail', event.id)} style={secondaryBtn}>
                                            Ver
                                        </button>
                                        <button onClick={() => setCurrentPage('edit-event', event.id)} style={secondaryBtn}>
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event)}
                                            disabled={deletingId === event.id}
                                            style={{
                                                ...dangerBtn,
                                                opacity: deletingId === event.id ? 0.6 : 1,
                                                cursor: deletingId === event.id ? 'not-allowed' : 'pointer',
                                            }}
                                        >
                                            {deletingId === event.id ? 'Eliminando...' : 'Eliminar'}
                                        </button>
                                    </div>
                                </div>

                                {/* Listado de participantes inscritos */}
                                {openId === event.id && (
                                    <div style={{ borderTop: '1px solid #e5e5e5', padding: '16px 20px', background: '#fafafa' }}>
                                        {loadingParticipants ? (
                                            <div style={{ fontSize: 12, color: '#7a7a7a' }}>Cargando participantes...</div>
                                        ) : participants.length === 0 ? (
                                            <div style={{ fontSize: 12, color: '#9a9a9a' }}>
                                                Este evento todavía no tiene inscritos.
                                            </div>
                                        ) : (
                                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                                                <thead>
                                                    <tr>
                                                        <th style={thStyle}>Nombre</th>
                                                        <th style={thStyle}>Correo</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {participants.map((p) => (
                                                        <tr key={p.id}>
                                                            <td style={tdStyle}>{p.name}</td>
                                                            <td style={tdStyle}>{p.email}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const cardStyle = {
    background: '#fff',
    border: '1px solid #d4d4d4',
    borderRadius: 4,
    overflow: 'hidden',
};

const primaryBtn = {
    background: '#2a2a2a',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    padding: '10px 18px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    letterSpacing: '0.03em',
};

const secondaryBtn = {
    background: 'none',
    color: '#5a5a5a',
    border: '1px solid #d4d4d4',
    borderRadius: 4,
    padding: '8px 14px',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
};

const dangerBtn = {
    background: 'none',
    color: '#a94442',
    border: '1px solid #e0b4b4',
    borderRadius: 4,
    padding: '8px 14px',
    fontSize: 12,
    fontWeight: 600,
    fontFamily: 'inherit',
};

const thStyle = {
    textAlign: 'left',
    padding: '6px 8px',
    color: '#9a9a9a',
    fontWeight: 600,
    textTransform: 'uppercase',
    fontSize: 10,
    letterSpacing: '0.06em',
    borderBottom: '1px solid #e5e5e5',
};

const tdStyle = {
    padding: '8px',
    color: '#3a3a3a',
    borderBottom: '1px solid #efefef',
};

const successStyle = {
    background: '#edf7ed',
    color: '#1e4620',
    border: '1px solid #c3e6cb',
    padding: '11px 14px',
    borderRadius: 4,
    fontSize: 13,
    marginBottom: 16,
    fontWeight: 600,
};

const errorStyle = {
    background: '#fdecea',
    color: '#611a15',
    border: '1px solid #f5c6cb',
    padding: '11px 14px',
    borderRadius: 4,
    fontSize: 13,
    marginBottom: 16,
};

const emptyStyle = {
    textAlign: 'center',
    padding: '70px 20px',
    background: '#fff',
    border: '1px dashed #d4d4d4',
    borderRadius: 4,
};
