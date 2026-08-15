export default function Header({ currentPage, setCurrentPage, role = 'user', isLoggedIn = false }) {
    return (
        <header
        style={{
            width: '100%',
            background: '#fff',
            borderBottom: '1px solid #e5e5e5',
            position: 'sticky',
            top: 0,
            zIndex: 100,
        }}
        >
        <div
            style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            }}
        >
            {/* LOGO & NOMBRE */}
            <div
            onClick={() => setCurrentPage('home')}
            style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
            >
            <div
                style={{
                width: 34,
                height: 34,
                background: '#2a2a2a',
                color: '#fff',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 14,
                }}
            >
                E
            </div>
            <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.1 }}>
                ESPOL Events
                </div>
                <div style={{ fontSize: 9, color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Plataforma Politécnica
                </div>
            </div>
            </div>

            {/* NAVEGACIÓN PRINCIPAL */}
            <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <button
                onClick={() => setCurrentPage('home')}
                style={navBtnStyle(currentPage === 'home')}
            >
                Inicio
            </button>
            
            <button
                onClick={() => setCurrentPage('home')}
                style={navBtnStyle(false)}
            >
                Facultades
            </button>

            {isLoggedIn && role === 'user' && (
                <button
                onClick={() => setCurrentPage('my-registrations')}
                style={navBtnStyle(currentPage === 'my-registrations')}
                >
                Mis Inscripciones
                </button>
            )}

            {isLoggedIn && role === 'organizer' && (
                <>
                <button
                    onClick={() => setCurrentPage('organizer-dashboard')}
                    style={navBtnStyle(currentPage === 'organizer-dashboard')}
                >
                    Dashboard
                </button>
                <button
                    onClick={() => setCurrentPage('create-event')}
                    style={{
                    background: '#2a2a2a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '7px 14px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    }}
                >
                    + Crear Evento
                </button>
                </>
            )}
            </nav>

            {/* ACCIONES DE USUARIO / LOGIN */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {!isLoggedIn ? (
                <>
                <button
                    onClick={() => alert('Abrir modal de Login')}
                    style={{
                    background: 'none',
                    border: '1px solid #d4d4d4',
                    borderRadius: 4,
                    padding: '7px 14px',
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer',
                    color: '#333',
                    }}
                >
                    Iniciar Sesión
                </button>
                <button
                    onClick={() => alert('Abrir modal de Login')}
                    style={{
                    background: 'none',
                    border: '1px solid #d4d4d4',
                    borderRadius: 4,
                    padding: '7px 14px',
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer',
                    color: '#333',
                    }}
                >
                    Registrarse
                </button>
                </>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                    style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#444',
                    }}
                >
                    DP
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#333' }}>Dhamar Patiño</span>
                </div>
            )}
            </div>
        </div>
        </header>
    );
}

function navBtnStyle(active) {
    return {
        background: 'none',
        border: 'none',
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        color: active ? '#1a1a1a' : '#666',
        borderBottom: active ? '2px solid #2a2a2a' : '2px solid transparent',
        padding: '8px 0',
        cursor: 'pointer',
        fontFamily: 'inherit',
    };
}