import { useState, useEffect } from 'react';
import Header from '../components/Header';
import EventCard from '../components/EventCard';
import { eventService } from '../services/eventService'; // O tu servicio de eventos

// Opciones por defecto para los selects de filtro
const FACULTIES = ['Todas', 'FIEC', 'FIMCP', 'FCSH', 'FICT', 'FCNM', 'FADCOM'];
const CATEGORIES = ['Todas', 'Conferencia', 'Taller', 'Seminario', 'Hackathon', 'Feria'];

export function HomePage({ currentPage, setCurrentPage, role = 'organizer' }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para filtros de búsqueda
    const [search, setSearch] = useState('');
    const [faculty, setFaculty] = useState('Todas');
    const [category, setCategory] = useState('Todas');
    const [date, setDate] = useState('');
    const [sortBy, setSortBy] = useState('recent');

    // Carga de datos desde la API / Supabase / Backend
    const fetchEvents = async () => {
        try {
        setLoading(true);
        const data = await eventService.getEvents({
            search,
            faculty: faculty !== 'Todas' ? faculty : '',
            category: category !== 'Todas' ? category : '',
            date,
        });
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
        const timer = setTimeout(() => {
        fetchEvents();
        }, 300); // Debounce para evitar llamadas excesivas en la búsqueda
        return () => clearTimeout(timer);
    }, [search, faculty, category, date]);

    // Filtrado local en caso de que utilices un arreglo local
    const filtered = events.filter((e) => {
        const matchSearch =
        (e.title && e.title.toLowerCase().includes(search.toLowerCase())) ||
        (e.description && e.description.toLowerCase().includes(search.toLowerCase()));
        const matchFaculty = faculty === 'Todas' || e.faculty === faculty;
        const matchCategory = category === 'Todas' || e.category === category;
        const matchDate = !date || e.date === date;
        return matchSearch && matchFaculty && matchCategory && matchDate;
    });

    // 2. Ordenamiento de eventos filtrados
    const sortedEvents = [...filtered].sort((a, b) => {
        if (sortBy === 'recent') {
            // Ordena de más nuevo a más antiguo por fecha/ID
            return new Date(b.date || 0) - new Date(a.date || 0);
            }
        
        if (sortBy === 'popular') {
            // Ordena por mayor porcentaje de ocupación o cupos tomados
            const totalA = a.max_participants || 100;
            const takenA = totalA - (a.available_spots ?? totalA);
            
            const totalB = b.max_participants || 100;
            const takenB = totalB - (b.available_spots ?? totalB);
            
            return takenB - takenA; // El que tiene más inscritos va primero
        }
        
        if (sortBy === 'upcoming') {
            // Ordena los eventos más próximos a la fecha actual
            return new Date(a.date || 0) - new Date(b.date || 0);
        }
        return 0;
    });

    return (
        <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} role={role} />

        {/* Hero / Search bar */}
        <div style={{ background: '#2a2a2a', padding: '48px 40px 40px' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div
                style={{
                fontSize: 11,
                color: '#888',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 10,
                fontFamily: 'JetBrains Mono, monospace',
                align: "center"
                }}
            >
                Escuela Superior Politécnica del Litoral
            </div>
            <h1 style={{ align: "center", margin: '0 0 6px', fontSize: 32, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                Eventos ESPOL
            </h1>
            <p style={{ align: "center", margin: '0 auto', fontSize: 14, color: '#a0a0a0', maxWidth: 480 }}>
                Descubre conferencias, talleres, ferias y más actividades organizadas por las facultades de ESPOL.
            </p>

            {/* Search Input */}
            <div style={{ display: 'flex', gap: 0, maxWidth: 600, align: "center", margin: '0 auto' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    }}
                >
                    <circle cx="9" cy="9" r="6" stroke="#9a9a9a" strokeWidth="1.6" />
                    <path d="M13.5 13.5L17 17" stroke="#9a9a9a" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar eventos, conferencias, talleres..."
                    style={{
                    width: '100%',
                    padding: '12px 16px 12px 40px',
                    border: '1px solid #444',
                    borderRight: 'none',
                    borderRadius: '4px 0 0 4px',
                    fontSize: 13,
                    background: '#fff',
                    color: '#1a1a1a',
                    outline: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    }}
                />
                </div>
                <button
                onClick={fetchEvents}
                style={{
                    background: '#fff',
                    color: '#2a2a2a',
                    border: '1px solid #444',
                    borderLeft: 'none',
                    borderRadius: '0 4px 4px 0',
                    padding: '0 20px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                }}
                >
                Buscar
                </button>
            </div>
            </div>
        </div>

        {/* Bar Filters */}
        <div style={{ background: '#fff', borderBottom: '1px solid #d4d4d4' }}>
            <div
            style={{
                maxWidth: 1280,
                margin: '0 auto',
                padding: '14px 40px',
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                flexWrap: 'wrap',
            }}
            >
            <span
                style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#7a7a7a',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                marginRight: 4,
                }}
            >
                Filtrar por
            </span>

            <FilterSelect label="Facultad" value={faculty} onChange={setFaculty} options={FACULTIES} />
            <FilterSelect label="Categoría" value={category} onChange={setCategory} options={CATEGORIES} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ fontSize: 12, color: '#5a5a5a', fontWeight: 500 }}>Fecha</label>
                <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                    border: '1px solid #d4d4d4',
                    borderRadius: 4,
                    padding: '6px 10px',
                    fontSize: 12,
                    color: '#3a3a3a',
                    background: '#fff',
                    fontFamily: 'inherit',
                    outline: 'none',
                }}
                />
            </div>

            {(faculty !== 'Todas' || category !== 'Todas' || date || search) && (
                <button
                onClick={() => {
                    setFaculty('Todas');
                    setCategory('Todas');
                    setDate('');
                    setSearch('');
                }}
                style={{
                    marginLeft: 'auto',
                    background: 'none',
                    border: '1px solid #d4d4d4',
                    borderRadius: 4,
                    padding: '6px 12px',
                    fontSize: 12,
                    color: '#7a7a7a',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                }}
                >
                Limpiar filtros
                </button>
            )}
            </div>
        </div>

        {/* Results Section */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 40px 60px' }}>
            <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 24,
            }}
            >
            <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>
                {search || faculty !== 'Todas' || category !== 'Todas' || date ? 'Resultados' : 'Todos los Eventos'}
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#9a9a9a' }}>
                    {sortedEvents.length} evento{sortedEvents.length !== 1 ? 's' : ''} encontrado{sortedEvents.length !== 1 ? 's' : ''}
                </p>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
                <SortBtn 
                    active={sortBy === 'recent'} 
                    onClick={() => setSortBy('recent')}
                >
                    Más recientes
                </SortBtn>

                <SortBtn 
                    active={sortBy === 'popular'} 
                    onClick={() => setSortBy('popular')}
                >
                    Más populares
                </SortBtn>

                <SortBtn 
                    active={sortBy === 'upcoming'} 
                    onClick={() => setSortBy('upcoming')}
                >
                    Próximos
                </SortBtn>
                </div>
            </div>

            {/* Carga y Errores */}
            {loading && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#7a7a7a', fontSize: 14 }}>
                Cargando eventos...
            </div>
            )}

            {error && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#d9534f', fontSize: 14 }}>
                {error}
            </div>
            )}

            {/* Grilla de Eventos o Estado Vacío */}
            {!loading && !error && (
            filtered.length === 0 ? (
                <div
                style={{
                    textAlign: 'center',
                    padding: '80px 20px',
                    background: '#fff',
                    border: '1px dashed #d4d4d4',
                    borderRadius: 4,
                }}
                >
                <div style={{ fontSize: 32, marginBottom: 12, color: '#9a9a9a' }}>○</div>
                <p style={{ fontSize: 14, color: '#7a7a7a', margin: 0 }}>
                    No se encontraron eventos con esos filtros.
                </p>
                </div>
            ) : (
                <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 20,
                }}
                >
                {sortedEvents.map((event) => (
                    <EventCard
                        key={event.id}
                        event={event}
                        onSelect={(selectedEvent) => navigate('event-detail', selectedEvent)}
                    />
                    ))}
                </div>
            )
            )}
        </div>
        </div>
    );
}

function FilterSelect({ label, value, onChange, options }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <label style={{ fontSize: 12, color: '#5a5a5a', fontWeight: 500 }}>{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
            border: '1px solid #d4d4d4',
            borderRadius: 4,
            padding: '6px 28px 6px 10px',
            fontSize: 12,
            color: '#3a3a3a',
            background: '#fff',
            fontFamily: 'inherit',
            outline: 'none',
            appearance: 'none',
            backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239a9a9a' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
            }}
        >
            {options.map((o) => (
            <option key={o} value={o}>
                {o}
            </option>
            ))}
        </select>
        </div>
    );
}

function SortBtn({ children, active, onClick }) {
    return (
        <button
        onClick={onClick}
        style={{
            background: active ? '#2a2a2a' : 'none',
            color: active ? '#fff' : '#7a7a7a',
            border: '1px solid',
            borderColor: active ? '#2a2a2a' : '#d4d4d4',
            borderRadius: 4,
            padding: '5px 12px',
            fontSize: 11,
            fontWeight: active ? 600 : 400,
            cursor: 'pointer',
            fontFamily: 'inherit',
            letterSpacing: '0.02em',
            transition: 'all 0.15s ease',
        }}
        >
        {children}
        </button>
    );
}