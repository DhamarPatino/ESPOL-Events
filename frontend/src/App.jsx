import React, { useState, useEffect } from 'react';

// Importación de tu Header
import Header from './components/Header';

// Importación de tus páginas
import HomePage from './pages/HomePage';
import FacultiesPage from './pages/FacultiesPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import OrganizerDashboardPage from './pages/OrganizerDashboardPage';
import CreateEventPage from './pages/CreateEventPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Estado de autenticación y rol
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('public');
  const [user, setUser] = useState(null);

  // 1. PERSISTENCIA AL RECARGAR (Lee token y datos de localStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (savedUser && token) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setRole(parsedUser.role || 'user');
      setIsLoggedIn(true);
    }
  }, []);

  // 2. MANEJO DE LOGIN EXITOSO
  const handleLoginSuccess = (userData, userRole) => {
    // Si userRole no se envía explícitamente, se extrae de userData.role
    const detectedRole = userRole || userData?.role || 'user';

    setUser(userData);
    setRole(detectedRole);
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  // 3. MANEJO DE CERRAR SESIÓN
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
      {/* HEADER GLOBAL */}
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

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>
    </div>
  );
}