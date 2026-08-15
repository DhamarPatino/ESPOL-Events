import React from 'react';

export default function FacultiesPage({ setCurrentPage }) {
    const faculties = [
        { id: 'FIEC', name: 'Facultad de Ingeniería en Electricidad y Computación' },
        { id: 'FIMCP', name: 'Facultad de Ingeniería Mecánica y Ciencias de la Producción' },
        { id: 'FCNM', name: 'Facultad de Ciencias Naturales y Matemáticas' },
        { id: 'FCSH', name: 'Facultad de Ciencias Sociales y Humanísticas' },
        { id: 'FADCOM', name: 'Facultad de Arte, Diseño y Comunicación Audiovisual' },
    ];

    return (
        <div style={{ maxWidth: 1280, margin: '40px auto', padding: '0 24px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: '#1a1a1a' }}>
            Facultades
        </h1>
        <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>
            Explora los eventos y talleres organizados por cada unidad académica de la ESPOL.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {faculties.map((fac) => (
            <div
                key={fac.id}
                onClick={() => setCurrentPage('home')}
                style={{
                background: '#fff',
                border: '1px solid #e5e5e5',
                borderRadius: 8,
                padding: 20,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                }}
            >
                <div style={{ fontWeight: 700, fontSize: 16, color: '#2a2a2a', marginBottom: 6 }}>
                {fac.id}
                </div>
                <div style={{ fontSize: 13, color: '#555', lineHeight: 1.4 }}>
                {fac.name}
                </div>
            </div>
            ))}
        </div>
        </div>
    );
}