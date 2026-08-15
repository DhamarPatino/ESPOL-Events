import { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { CreateEventPage } from './pages/CreateEventPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="min-h-screen bg-white-100 flex flex-col">
      
      <div className="flex-1">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'create' && <CreateEventPage />}
      </div>
    </div>
  );
}