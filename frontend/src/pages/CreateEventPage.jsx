import { useState } from 'react';
import { eventService } from '../services/eventService';

export function CreateEventPage() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        modality: 'Presencial',
        faculty: '',
        date: '',
        start_time: '',
        location: '',
        max_participants: 50,
    });

    const [status, setStatus] = useState({ loading: false, success: null, error: null });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: null, error: null });

        try {
        const response = await eventService.createEvent(formData);
        setStatus({ loading: false, success: response.message, error: null });

        // Limpiar formulario tras éxito
        setFormData({
            title: '',
            description: '',
            category: '',
            modality: 'Presencial',
            faculty: '',
            date: '',
            start_time: '',
            location: '',
            max_participants: 50,
        });
        } catch (err) {
        setStatus({ loading: false, success: null, error: err.message });
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg my-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Crear Nuevo Evento</h2>

        {status.success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {status.success}
            </div>
        )}

        {status.error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {status.error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título del Evento</label>
            <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
            />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
                name="description"
                rows="3"
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
            ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <input
                type="text"
                name="category"
                placeholder="Ej. Taller, Conferencia"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full border rounded p-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad</label>
                <select
                name="modality"
                value={formData.modality}
                onChange={handleChange}
                className="w-full border rounded p-2 bg-white"
                >
                <option value="Presencial">Presencial</option>
                <option value="Virtual">Virtual</option>
                <option value="Híbrido">Híbrido</option>
                </select>
            </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facultad</label>
                <input
                type="text"
                name="faculty"
                placeholder="Ej. FIEC"
                required
                value={formData.faculty}
                onChange={handleChange}
                className="w-full border rounded p-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lugar / Aula</label>
                <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full border rounded p-2"
                />
            </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full border rounded p-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hora Inicio (HH:MM)</label>
                <input
                type="time"
                name="start_time"
                required
                value={formData.start_time}
                onChange={handleChange}
                className="w-full border rounded p-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cupos Máximos</label>
                <input
                type="number"
                name="max_participants"
                min="1"
                required
                value={formData.max_participants}
                onChange={handleChange}
                className="w-full border rounded p-2"
                />
            </div>
            </div>

            <button
            type="submit"
            disabled={status.loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
            >
            {status.loading ? 'Guardando...' : 'Crear Evento'}
            </button>
        </form>
        </div>
    );
}