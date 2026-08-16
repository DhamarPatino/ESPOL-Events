import { useState } from 'react';

// Perfil del usuario con sus datos de cuenta -- Dhamar Patiño

export default function ProfilePage({ user, role, onLogout, setCurrentPage }) {
    const [confirmando, setConfirmando] = useState(false);

    // Nombre legible del tipo de cuenta
    const tipoCuenta = role === 'organizer' ? 'Organizador' : 'Participante';

    // Iniciales para el avatar
    const iniciales = (user?.name || '?')
        .trim()
        .split(' ')
        .map((p) => p.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase();

    if (!user) {
        return (
            <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '80px 40px', textAlign: 'center' }}>
                <p style={{ fontSize: 14, color: '#7a7a7a', marginBottom: 20 }}>
                    Inicia sesión para ver tu perfil.
                </p>
                <button onClick={() => setCurrentPage('login')} style={primaryBtn}>
                    Iniciar sesión
                </button>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 40px 60px' }}>

                <div style={{ marginBottom: 26 }}>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>
                        Mi Perfil
                    </h1>
                    <p style={{ margin: '6px 0 0', fontSize: 13, color: '#7a7a7a' }}>
                        Datos de tu cuenta en la plataforma.
                    </p>
                </div>

                <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
                        <div style={avatarStyle}>{iniciales}</div>
                        <div>
                            <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>
                                {user.name}
                            </div>
                            <div style={{ fontSize: 12, color: '#7a7a7a' }}>{tipoCuenta}</div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
                        <Dato label="Nombre" valor={user.name} />
                        <Dato label="Correo" valor={user.email} />
                        <Dato label="Tipo de cuenta" valor={tipoCuenta} />
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {role === 'organizer' ? (
                            <button onClick={() => setCurrentPage('organizer-dashboard')} style={secondaryBtn}>
                                Ir al panel del organizador
                            </button>
                        ) : (
                            <button onClick={() => setCurrentPage('my-registrations')} style={secondaryBtn}>
                                Ver mis inscripciones
                            </button>
                        )}

                        {!confirmando ? (
                            <button onClick={() => setConfirmando(true)} style={dangerBtn}>
                                Cerrar sesión
                            </button>
                        ) : (
                            <>
                                <button onClick={onLogout} style={dangerBtn}>
                                    Confirmar
                                </button>
                                <button onClick={() => setConfirmando(false)} style={secondaryBtn}>
                                    Cancelar
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Dato({ label, valor }) {
    return (
        <div style={{ display: 'flex', gap: 10, fontSize: 13, borderBottom: '1px solid #efefef', paddingBottom: 10 }}>
            <span style={{ minWidth: 120, color: '#9a9a9a' }}>{label}</span>
            <span style={{ color: '#3a3a3a', fontWeight: 500 }}>{valor}</span>
        </div>
    );
}

const cardStyle = {
    background: '#fff',
    border: '1px solid #d4d4d4',
    borderRadius: 4,
    padding: '22px 24px',
};

const avatarStyle = {
    width: 52,
    height: 52,
    background: '#2a2a2a',
    color: '#fff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 17,
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
};

const secondaryBtn = {
    background: 'none',
    color: '#5a5a5a',
    border: '1px solid #d4d4d4',
    borderRadius: 4,
    padding: '9px 16px',
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
    padding: '9px 16px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
};
