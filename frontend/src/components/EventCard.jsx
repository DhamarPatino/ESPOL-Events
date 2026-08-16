import React, { useState } from 'react';
import ImagePlaceholder from './ImagePlaceholder';

export default function EventCard({ event, onSelect }) {
    const [imgError, setImgError] = useState(false);

    // Mapeo de campos de la base de datos de Laravel / PostgreSQL
    const maxSeats = event.max_participants || 100;
    const availableSeats = event.available_spots ?? maxSeats;
    const takenSeats = maxSeats - availableSeats;
    const pct = Math.round((takenSeats / maxSeats) * 100);

    // Formateador de fecha (2026-08-25 -> 25 Aug 2026) y rango de horas (09:00 – 11:30)
    const formatDateTime = (dateStr, startTime, endTime) => {
        if (!dateStr) return '';

        // Evita desfases de zona horaria dividiendo la fecha manualmente
        const [year, month, day] = dateStr.split('-');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedDate = `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;

        const cleanStart = startTime ? startTime.slice(0, 5) : '';
        const cleanEnd = endTime ? endTime.slice(0, 5) : '';
        const timeRange = cleanEnd ? `${cleanStart} – ${cleanEnd}` : cleanStart;

        return `${formattedDate} · ${timeRange}`;
    };

    return (
        <div
        style={{
            background: '#fff',
            border: '1px solid #d4d4d4',
            borderRadius: 4,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'box-shadow 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')}
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
        {/* RENDERIZADO DE IMAGEN O PLACEHOLDER */}
        {event.image && !imgError ? (
            <div style={{ width: '100%', height: 160, overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
            <img
                src={event.image}
                alt={event.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={() => setImgError(true)}
            />
            </div>
        ) : (
            <ImagePlaceholder height={160} label="Imagen del evento" style={{ borderRadius: 0 }} />
        )}

        <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
            {/* Tags de Facultad y Categoría */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Tag>{event.faculty}</Tag>
            <Tag>{event.category}</Tag>
            </div>

            {/* Título */}
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.3 }}>
            {event.title}
            </h3>

            {/* Fecha y Hora Formateadas */}
            <div style={{ fontSize: 12, color: '#7a7a7a', display: 'flex', alignItems: 'center', gap: 4 }}>
            <CalIcon /> {formatDateTime(event.date, event.start_time, event.end_time)}
            </div>

            {/* Ubicación */}
            <div style={{ fontSize: 12, color: '#7a7a7a', display: 'flex', alignItems: 'center', gap: 4 }}>
            <PinIcon /> {event.location}
            </div>

            {/* Descripción corta */}
            <p style={{ margin: 0, fontSize: 12, color: '#5a5a5a', lineHeight: 1.55, flex: 1 }}>
            {event.description?.slice(0, 110)}
            {event.description?.length > 110 ? '…' : ''}
            </p>

            {/* Barra de Cupos (Seats bar) */}
            <div style={{ marginTop: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 11, color: '#9a9a9a' }}>
                <span>{availableSeats} cupos disponibles</span>
                <span>{pct}% lleno</span>
            </div>
            <div style={{ height: 4, background: '#efefef', borderRadius: 2 }}>
                <div
                style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: pct > 80 ? '#888' : '#c0c0c0',
                    borderRadius: 2,
                }}
                />
            </div>
            </div>

            {/* Botón de ver detalles */}
            <button
            onClick={() => onSelect && onSelect(event)}
            style={{
                marginTop: 8,
                background: '#2a2a2a',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                padding: '9px 0',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                width: '100%',
                letterSpacing: '0.03em',
                transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#3d3d3d')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#2a2a2a')}
            >
            Ver detalles
            </button>
        </div>
        </div>
    );
}

function Tag({ children }) {
    return (
        <span
        style={{
            background: '#efefef',
            color: '#5a5a5a',
            fontSize: 10,
            fontWeight: 600,
            padding: '3px 8px',
            borderRadius: 3,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
        }}
        >
        {children}
        </span>
    );
}

function CalIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="#9a9a9a" strokeWidth="1.3" />
        <path d="M5 2v2M11 2v2M2 7h12" stroke="#9a9a9a" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
    );
}

function PinIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
        <path
            d="M8 1.5C5.79 1.5 4 3.29 4 5.5c0 3.25 4 9 4 9s4-5.75 4-9c0-2.21-1.79-4-4-4z"
            stroke="#9a9a9a"
            strokeWidth="1.3"
        />
        <circle cx="8" cy="5.5" r="1.5" stroke="#9a9a9a" strokeWidth="1.3" />
        </svg>
    );
}