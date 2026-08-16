import { useState, useRef, useEffect } from 'react';
import { eventService } from '../services/eventService';

const FACULTIES_LIST = ['FIEC', 'FIMCP', 'FCSH', 'FICT', 'FCNM', 'FADCOM', 'FIMCBOR'];
const CATEGORIES_LIST = ['Conferencia', 'Taller', 'Seminario', 'Hackathon', 'Feria', 'Networking'];

export default function CreateEventPage({ navigate, mode = 'create', eventId = null }) {
    const isEdit = mode === 'edit';

    const [form, setForm] = useState({
        title: '',
        description: '',
        faculty: FACULTIES_LIST[0],
        category: CATEGORIES_LIST[0],
        type: 'Presencial',
        date: '',
        time: '',
        endTime: '',
        location: '',
        capacity: '',
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false); // 👈 Nuevo estado para mensaje de éxito

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    // En modo edición se cargan los datos reales del evento -- Cristina Pihuave
    useEffect(() => {
        if (!isEdit || !eventId) return;

        const cargarEvento = async () => {
            try {
                const data = await eventService.getEventById(eventId);
                const ev = data.event;

                setForm({
                    id: ev.id,
                    title: ev.title || '',
                    description: ev.description || '',
                    faculty: ev.faculty || FACULTIES_LIST[0],
                    category: ev.category || CATEGORIES_LIST[0],
                    type: ev.modality || 'Presencial',
                    date: ev.date || '',
                    time: ev.start_time ? ev.start_time.slice(0, 5) : '',
                    endTime: ev.end_time ? ev.end_time.slice(0, 5) : '',
                    location: ev.location || '',
                    capacity: ev.max_participants ? String(ev.max_participants) : '',
                });

                if (ev.image) setImagePreview(ev.image);
            } catch (err) {
                console.error('Error al cargar el evento:', err);
                setError('No se pudo cargar la información del evento.');
            }
        };

        cargarEvento();
    }, [isEdit, eventId]);

    // Helper seguro para navegar sin romper la app si no se pasó la función
    const safeNavigate = (page) => {
        if (typeof navigate === 'function') {
            navigate(page);
        } else {
            // Redirección nativa si no usas Router ni pasas la función desde App
            window.location.href = '/'; 
        }
};

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!form.title || !form.description || !form.date || !form.time || !form.location || !form.capacity) {
            setError('Por favor completa todos los campos obligatorios (*).');
            setLoading(false);
            return;
        }

        if (form.endTime && form.endTime <= form.time) {
            setError('La hora de finalización debe ser posterior a la hora de inicio.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('description', form.description);
        formData.append('faculty', form.faculty);
        formData.append('category', form.category);
        formData.append('modality', form.type || 'Presencial');
        formData.append('date', form.date);
        formData.append('start_time', form.time);
        if (form.endTime) formData.append('end_time', form.endTime);
        formData.append('max_participants', parseInt(form.capacity, 10));
        formData.append('location', form.location.trim());

        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            if (isEdit) {
                formData.append('_method', 'PUT');
                await eventService.updateEvent(form.id, formData);
            } else {
                await eventService.createEvent(formData);
            }

            // 1. Marcar creación como exitosa
            setSuccess(true);

            // 2. Redirigir a inicio después de 1.5 segundos
            setTimeout(() => {
                safeNavigate('home');
            }, 1500);

        } catch (err) {
            console.error('Error al guardar el evento:', err);
            setError('Ocurrió un error al guardar el evento en el servidor. Verifica los datos.');
        } finally {
            setLoading(false);
        }
    };

    const isDisabled = loading || success; // Bloquea interacción durante carga o tras éxito

    return (
        <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 40px 60px' }}>
                
                {/* Breadcrumb */}
                <div style={{ fontSize: 12, color: '#9a9a9a', marginBottom: 24, display: 'flex', gap: 6 }}>
                    <button
                        type="button"
                        disabled={isDisabled}
                        onClick={() => safeNavigate('home')}
                        style={{ background: 'none', border: 'none', color: '#9a9a9a', cursor: isDisabled ? 'not-allowed' : 'pointer', fontSize: 12, padding: 0, fontFamily: 'inherit' }}
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
                </div>

                {/* Notificación de Éxito */}
                {success && (
                    <div style={{ background: '#edf7ed', color: '#1e4620', border: '1px solid #c3e6cb', padding: '12px 16px', borderRadius: 4, fontSize: 13, marginBottom: 20, fontWeight: 600 }}>
                        ¡Evento {isEdit ? 'actualizado' : 'creado'} correctamente! Redirigiendo a inicio...
                    </div>
                )}

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
                            <input disabled={isDisabled} value={form.title} onChange={set('title')} placeholder="Ej: Conferencia de Innovación Tecnológica 2026" style={inputStyle} />
                        </Field>

                        <Field label="Descripción" required>
                            <textarea
                                disabled={isDisabled}
                                value={form.description}
                                onChange={set('description')}
                                placeholder="Describe el evento, objetivos, agenda..."
                                rows={4}
                                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.55 }}
                            />
                        </Field>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <Field label="Facultad" required>
                                <select disabled={isDisabled} value={form.faculty} onChange={set('faculty')} style={inputStyle}>
                                    {FACULTIES_LIST.map((f) => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </Field>

                            <Field label="Categoría" required>
                                <select disabled={isDisabled} value={form.category} onChange={set('category')} style={inputStyle}>
                                    {CATEGORIES_LIST.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        <Field label="Tipo de Evento">
                            <select disabled={isDisabled} value={form.type} onChange={set('type')} style={inputStyle}>
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
                                <input disabled={isDisabled} type="date" value={form.date} onChange={set('date')} style={inputStyle} />
                            </Field>

                            <Field label="Hora de inicio" required>
                                <input disabled={isDisabled} type="time" value={form.time} onChange={set('time')} style={inputStyle} />
                            </Field>

                            <Field label="Hora de fin">
                                <input disabled={isDisabled} type="time" value={form.endTime} onChange={set('endTime')} style={inputStyle} />
                            </Field>
                        </div>

                        <Field label="Ubicación" required>
                            <input disabled={isDisabled} value={form.location} onChange={set('location')} placeholder="Ej: Auditorio Principal – Campus ESPOL" style={inputStyle} />
                        </Field>
                    </FormSection>

                    {/* Capacidad */}
                    <FormSection title="Capacidad">
                        <div style={{ maxWidth: 260 }}>
                            <Field label="Capacidad máxima" required>
                                <input disabled={isDisabled} type="number" value={form.capacity} onChange={set('capacity')} placeholder="Ej: 120" min="1" style={inputStyle} />
                            </Field>
                        </div>
                    </FormSection>

                    {/* Imagen del Evento */}
                    <FormSection title="Imagen del Evento">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleInputFileChange}
                            accept="image/png, image/jpeg, image/jpg"
                            style={{ display: 'none' }}
                            disabled={isDisabled}
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
                                opacity: isDisabled ? 0.6 : 1,
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
                                            disabled={isDisabled}
                                            style={{ background: '#fdeded', color: '#5f2120', border: '1px solid #f5c2c2', borderRadius: 4, padding: '4px 8px', fontSize: 11, cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                                        >
                                            Quitar imagen
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div style={{ width: 60, height: 60, background: '#e0e0e0', borderRadius: '50%', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#888' }}>🖼️</div>
                                    <p style={{ margin: '8px 0 0', fontSize: 12, color: '#7a7a7a' }}>
                                        Arrastra una imagen aquí o{' '}
                                        <span
                                            onClick={() => !isDisabled && fileInputRef.current?.click()}
                                            style={{ color: '#3a3a3a', fontWeight: 600, cursor: isDisabled ? 'not-allowed' : 'pointer', textDecoration: 'underline' }}
                                        >
                                            selecciona un archivo
                                        </span>
                                    </p>
                                </>
                            )}
                        </div>
                    </FormSection>

                    {/* Botones de Acción */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #e4e4e4' }}>
                        <button
                            type="button"
                            onClick={() => safeNavigate('home')}
                            disabled={isDisabled}
                            style={{
                                background: 'none',
                                border: '1px solid #d4d4d4',
                                borderRadius: 4,
                                padding: '11px 24px',
                                fontSize: 13,
                                color: '#5a5a5a',
                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                opacity: isDisabled ? 0.5 : 1,
                            }}
                        >
                            Cancelar
                        </button>

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button
                                type="button"
                                disabled={isDisabled}
                                style={{
                                    background: 'none',
                                    border: '1px solid #d4d4d4',
                                    borderRadius: 4,
                                    padding: '11px 20px',
                                    fontSize: 13,
                                    color: '#5a5a5a',
                                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                                    opacity: isDisabled ? 0.5 : 1,
                                }}
                            >
                                Guardar borrador
                            </button>

                            <button
                                type="submit"
                                disabled={isDisabled}
                                style={{
                                    background: isDisabled ? '#888' : '#2a2a2a',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 4,
                                    padding: '11px 28px',
                                    fontSize: 13,
                                    fontWeight: 700,
                                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                                    opacity: isDisabled ? 0.7 : 1,
                                }}
                            >
                                {loading ? 'Guardando...' : success ? '¡Publicado!' : isEdit ? 'Guardar Cambios' : 'Publicar Evento'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

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

function FormSection({ title, children }) {
    return (
        <div style={{ background: '#fff', border: '1px solid #d4d4d4', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ padding: '14px 22px', borderBottom: '1px solid #efefef', background: '#fafafa' }}>
                <h2 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{title}</h2>
            </div>
            <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
        </div>
    );
}

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