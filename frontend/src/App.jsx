import React, { useState } from 'react';

// Importación de tu Header
import Header from './components/Header';

// Importación de tus páginas (ajusta las rutas según la estructura de tu proyecto)
import HomePage from './pages/HomePage';
import FacultiesPage from './pages/FacultiesPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import OrganizerDashboardPage from './pages/OrganizerDashboardPage';
import CreateEventPage from './pages/CreateEventPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  // Estado para controlar la página actual
  const [currentPage, setCurrentPage] = useState('home');

  // Estado de autenticación y rol proveniente del Backend / BD
  // role: 'public' | 'user' | 'organizer'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('public');
  const [user, setUser] = useState(null);

  // Ejemplo de login simulado (conecta esto con tus peticiones HTTP/Fetch al Backend)
  const handleLoginSuccess = (userData, userRole) => {
    setUser(userData);
    setRole(userRole);
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    setRole('public');
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  // Switch de renderizado dinámico de páginas
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} user={user} role={role} />;
      case 'faculties':
        return <FacultiesPage setCurrentPage={setCurrentPage} />;
      case 'my-registrations':
        return <MyRegistrationsPage user={user} />;
      case 'organizer-dashboard':
        return <OrganizerDashboardPage user={user} setCurrentPage={setCurrentPage} />;
      case 'create-event':
        return <CreateEventPage user={user} setCurrentPage={setCurrentPage} />;
      case 'profile':
        return <ProfilePage user={user} role={role} />;
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} setCurrentPage={setCurrentPage} />;
      case 'register':
        return <RegisterPage setCurrentPage={setCurrentPage} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} user={user} role={role} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* HEADER GLOBAL: Se renderiza siempre arriba y recibe el estado centralizado */}
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        role={role}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
        onOpenLogin={() => setCurrentPage('login')}
        onOpenRegister={() => setCurrentPage('register')}
      />

      {/* CONTENIDO PRINCIPAL SEGÚN LA PÁGINA SELECCIONADA */}
      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>
    </div>
  );
}