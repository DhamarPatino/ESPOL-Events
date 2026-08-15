import { useState, useRef } from 'react';
import { eventService } from '../services/eventService';

// Listas de facultades y categorías por defecto
const FACULTIES_LIST = ['FIEC', 'FIMCP', 'FCSH', 'FICT', 'FCNM', 'FADCOM', 'FIMCBOR'];
const CATEGORIES_LIST = ['Conferencia', 'Taller', 'Seminario', 'Hackathon', 'Feria', 'Networking'];

export default function CreateEventPage({ navigate, mode = 'create' }) {
    const isEdit = mode === 'edit';

    // 1. Estado principal del formulario
    const [form, setForm] = useState({
        title: isEdit ? 'Innovación Tecnológica en la Industria 4.0' : '',
        description: isEdit ? 'Expertos de la industria abordan el impacto de la automatización, el IoT y la inteligencia artificial en los procesos productivos actuales.' : '',
        faculty: isEdit ? 'FIEC' : FACULTIES_LIST[0],
        category: isEdit ? 'Conferencia' : CATEGORIES_LIST[0],
        type: isEdit ? 'Presencial' : 'Presencial',
        date: isEdit ? '2026-08-15' : '',
        time: isEdit ? '09:00' : '',
        endTime: isEdit ? '12:00' : '',
        location: isEdit ? 'Auditorio Principal' : '',
        capacity: isEdit ? '120' : '',
    });

    // 2. Estados para manejo de imágenes
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // 3. Estados para llamadas al servidor
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Helper para Inputs de texto/select
    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    // --- LÓGICA DE MANEJO DE IMAGEN ---
    const handleFileChange = (file) => {
        if (file && file.type.startsWith('image/')) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        } else {
        alert('Por favor, selecciona un archivo de imagen válido (PNG, JPG).');
        }
    };

    const handleInputFileChange = (e) => {
        const file = e.target.files[0];
        if (file) handleFileChange(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileChange(file);
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // --- ENVÍO DEL FORMULARIO ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validaciones del frontend
        if (!form.title || !form.description || !form.date || !form.time || !form.location || !form.capacity) {
        setError('Por favor completa todos los campos obligatorios (*).');
        setLoading(false);
        return;
        }
        // VALIDACIÓN DE HORA: Si ingresó hora de fin, verificar que sea mayor a la de inicio
        if (form.endTime && form.endTime <= form.time) {
        setError('La hora de finalización debe ser posterior a la hora de inicio.');
        setLoading(false);
        return;
        }

        // Adaptación de nombres para evitar error 422 del backend
        const payload = {
        title: form.title,
        description: form.description,
        faculty: form.faculty,
        category: form.category,
        modality: form.type || 'Presencial', 
        date: form.date,
        start_time: form.time,               // 
        end_time: form.endTime || null,
        max_participants: parseInt(form.capacity, 10),
        location: form.location.trim(),
        image: imageFile // Archivo de imagen si está disponible
        };

        try {
        if (isEdit) {
            console.log('Actualizando evento...', payload);
        } else {
            await eventService.createEvent(payload);
        }

        navigate('home');
        } catch (err) {
        console.error('Error al guardar el evento:', err);
        setError('Ocurrió un error al guardar el evento en el servidor. Verifica los datos.');
        } finally {
        setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 40px 60px' }}>
            {/* Breadcrumb */}
            <div style={{ fontSize: 12, color: '#9a9a9a', marginBottom: 24, display: 'flex', gap: 6 }}>
            <button
                type="button"
                onClick={() => navigate('home')}
                style={{ background: 'none', border: 'none', color: '#9a9a9a', cursor: 'pointer', fontSize: 12, padding: 0, fontFamily: 'inherit' }}
            >
                Inicio
            </button>
            <span>/</span>
            <span style={{ color: '#4a4a4a' }}>{isEdit ? 'Editar Evento' : 'Crear Evento'}</span>
            </div>

            {/* Encabezado */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
            <div>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>
                {isEdit ? 'Editar Evento' : 'Crear Nuevo Evento'}
                </h1>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: '#7a7a7a' }}>
                {isEdit ? 'Actualiza la información del evento.' : 'Completa el formulario para publicar un nuevo evento.'}
                </p>
            </div>
            {isEdit && (
                <span style={{ background: '#e8f0e8', color: '#2a6a2a', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 3, fontFamily: 'monospace' }}>
                ACTIVO
                </span>
            )}
            </div>

            {/* Notificación de Error */}
            {error && (
            <div style={{ background: '#fdeded', color: '#5f2120', padding: '12px 16px', borderRadius: 4, fontSize: 13, marginBottom: 20 }}>
                {error}
            </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Información General */}
            <FormSection title="Información General">
                <Field label="Título del Evento" required>
                <input value={form.title} onChange={set('title')} placeholder="Ej: Conferencia de Innovación Tecnológica 2026" style={inputStyle} />
                </Field>

                <Field label="Descripción" required>
                <textarea
                    value={form.description}
                    onChange={set('description')}
                    placeholder="Describe el evento, objetivos, agenda..."
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.55 }}
                />
                </Field>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Facultad" required>
                    <select value={form.faculty} onChange={set('faculty')} style={inputStyle}>
                    {FACULTIES_LIST.map((f) => (
                        <option key={f} value={f}>{f}</option>
                    ))}
                    </select>
                </Field>

                <Field label="Categoría" required>
                    <select value={form.category} onChange={set('category')} style={inputStyle}>
                    {CATEGORIES_LIST.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                    </select>
                </Field>
                </div>

                <Field label="Tipo de Evento">
                <select value={form.type} onChange={set('type')} style={inputStyle}>
                    <option value="Presencial">Presencial</option>
                    <option value="Virtual">Virtual</option>
                    <option value="Híbrido">Híbrido</option>
                </select>
                </Field>
            </FormSection>

            {/* Fecha, Hora y Lugar */}
            <FormSection title="Fecha, Hora y Lugar">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <Field label="Fecha" required>
                    <input type="date" value={form.date} onChange={set('date')} style={inputStyle} />
                </Field>

                <Field label="Hora de inicio" required>
                    <input type="time" value={form.time} onChange={set('time')} style={inputStyle} />
                </Field>

                <Field label="Hora de fin">
                    <input type="time" value={form.endTime} onChange={set('endTime')} style={inputStyle} />
                </Field>
                </div>

                <Field label="Ubicación" required>
                <input value={form.location} onChange={set('location')} placeholder="Ej: Auditorio Principal – Campus ESPOL" style={inputStyle} />
                </Field>
            </FormSection>

            {/* Capacidad */}
            <FormSection title="Capacidad">
                <div style={{ maxWidth: 260 }}>
                <Field label="Capacidad máxima" required>
                    <input type="number" value={form.capacity} onChange={set('capacity')} placeholder="Ej: 120" min="1" style={inputStyle} />
                </Field>
                </div>
                {form.capacity && (
                <p style={{ margin: '8px 0 0', fontSize: 12, color: '#7a7a7a' }}>
                    El evento aceptará hasta <b>{form.capacity}</b> participantes registrados.
                </p>
                )}
            </FormSection>

            {/* Imagen de Evento (FUNCIONAL) */}
            <FormSection title="Imagen del Evento">
                <input
                type="file"
                ref={fileInputRef}
                onChange={handleInputFileChange}
                accept="image/png, image/jpeg, image/jpg"
                style={{ display: 'none' }}
                />

                <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                    border: isDragging ? '2px dashed #2a2a2a' : '2px dashed #c8c8c8',
                    borderRadius: 4,
                    padding: '24px',
                    textAlign: 'center',
                    background: isDragging ? '#f0f0f0' : '#fafafa',
                    transition: 'all 0.2s ease',
                }}
                >
                {imagePreview ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <img src={imagePreview} alt="Vista previa" style={{ maxHeight: 180, maxWidth: '100%', borderRadius: 4, objectFit: 'cover' }} />
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: '#4a4a4a', fontWeight: 600 }}>{imageFile?.name}</span>
                        <button
                        type="button"
                        onClick={removeImage}
                        style={{ background: '#fdeded', color: '#5f2120', border: '1px solid #f5c2c2', borderRadius: 4, padding: '4px 8px', fontSize: 11, cursor: 'pointer' }}
                        >
                        Quitar imagen
                        </button>
                    </div>
                    </div>
                ) : (
                    <>
                    <div style={{ width: 60, height: 60, background: '#e0e0e0', borderRadius: '50%', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#888' }}>
                        🖼️
                    </div>
                    <p style={{ margin: '8px 0 0', fontSize: 12, color: '#7a7a7a' }}>
                        Arrastra una imagen aquí o{' '}
                        <span
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        style={{ color: '#3a3a3a', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                        >
                        selecciona un archivo
                        </span>
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: '#aaa' }}>PNG, JPG – Máx. 5 MB · Recomendado: 1200×630px</p>
                    </>
                )}
                </div>
            </FormSection>

            {/* Botones de Acción */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #e4e4e4' }}>
                <button
                type="button"
                onClick={() => navigate('home')}
                style={{ background: 'none', border: '1px solid #d4d4d4', borderRadius: 4, padding: '11px 24px', fontSize: 13, color: '#5a5a5a', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                Cancelar
                </button>

                <div style={{ display: 'flex', gap: 10 }}>
                <button
                    type="button"
                    style={{ background: 'none', border: '1px solid #d4d4d4', borderRadius: 4, padding: '11px 20px', fontSize: 13, color: '#5a5a5a', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                    Guardar borrador
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                    background: loading ? '#888' : '#2a2a2a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '11px 28px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    letterSpacing: '0.02em',
                    }}
                >
                    {loading ? 'Guardando...' : isEdit ? 'Guardar Cambios' : 'Publicar Evento'}
                </button>
                </div>
            </div>
            </form>
        </div>
        </div>
    );
}

// Estilos globales de los inputs
const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #d4d4d4',
    borderRadius: 4,
    fontSize: 13,
    color: '#1a1a1a',
    background: '#fff',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
};

// Componente para Secciones del Formulario
function FormSection({ title, children }) {
    return (
        <div style={{ background: '#fff', border: '1px solid #d4d4d4', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ padding: '14px 22px', borderBottom: '1px solid #efefef', background: '#fafafa' }}>
            <h2 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.01em' }}>{title}</h2>
        </div>
        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
        </div>
    );
}

// Componente para Etiqueta y Campo
function Field({ label, required, children }) {
    return (
        <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#3a3a3a', marginBottom: 6 }}>
            {label}
            {required && <span style={{ color: '#9a9a9a', marginLeft: 3 }}>*</span>}
        </label>
        {children}
        </div>
    );
}