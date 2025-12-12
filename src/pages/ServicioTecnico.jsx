import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { agendarCitaAPI } from '../services/dataService';

const ServicioTecnico = () => {
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        email: '',
        dispositivo: '',
        fecha: '',
        mensaje: ''
    });

    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState(null); 

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'telefono' && /[^0-9\s+]/.test(value)) return; 
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);
        const newErrors = {};

        if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
        if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es obligatorio.";
        else if (formData.telefono.replace(/\D/g, '').length < 8) newErrors.telefono = "Mínimo 8 dígitos.";
        
        if (!formData.email.trim()) newErrors.email = "El correo es obligatorio.";
        else if (!isValidEmail(formData.email)) newErrors.email = "Correo inválido.";

        if (!formData.dispositivo) newErrors.dispositivo = "Selecciona un dispositivo.";
        if (!formData.fecha) newErrors.fecha = "Selecciona una fecha.";
        else if (formData.fecha < today) newErrors.fecha = "Fecha inválida.";

        if (!formData.mensaje || formData.mensaje.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
            newErrors.mensaje = "Cuéntanos el problema.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setStatus({ text: "Enviando solicitud...", type: "info" });
            await agendarCitaAPI(formData);
            navigate('/cita-confirmacion', { state: { cita: formData } });
        } catch (error) {
            setStatus({ text: "Error al conectar. Intenta más tarde.", type: "error" });
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'size': [] }],
            ['bold', 'italic', 'underline', 'strike'],  
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
        ],
    };

    return (
        <main>
            <section className="page-header-tecnico">
                <h1>Agenda tu Reparación</h1>
                <p>Expertos certificados listos para revivir tus dispositivos.</p>
            </section>

            <section className="contenedor-formulario-tecnico">
                <div className="card-formulario">
                    <h2><i className="fa-solid fa-screwdriver-wrench"></i> Datos de la Cita</h2>
                    <p className="subtitulo-form">Completa el formulario y te contactaremos.</p>
                    
                    {status && (
                        <div className={`notification-box ${status.type === 'error' ? 'notify-error' : 'notify-info'}`}>
                            {status.text}
                        </div>
                    )}

                    <form className="form-grid" onSubmit={handleSubmit}>
                        
                        <div className="input-group">
                            <label htmlFor="nombre">Nombre Completo</label>
                            <input type="text" id="nombre" name="nombre" placeholder="" value={formData.nombre} onChange={handleChange} className={errors.nombre ? 'input-error' : ''}/>
                            {errors.nombre && <span className="msg-error">{errors.nombre}</span>}
                        </div>

                        <div className="input-group">
                            <label htmlFor="telefono">Teléfono</label>
                            <input type="tel" id="telefono" name="telefono" placeholder="+56 9 ..." value={formData.telefono} onChange={handleChange} className={errors.telefono ? 'input-error' : ''}/>
                            {errors.telefono && <span className="msg-error">{errors.telefono}</span>}
                        </div>

                        <div className="input-group full-width">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input type="email" id="email" name="email" placeholder="nombre@correo.com" value={formData.email} onChange={handleChange} className={errors.email ? 'input-error' : ''}/>
                            {errors.email && <span className="msg-error">{errors.email}</span>}
                        </div>

                        <div className="input-group">
                            <label htmlFor="dispositivo">Dispositivo</label>
                            <select id="dispositivo" name="dispositivo" value={formData.dispositivo} onChange={handleChange} className={errors.dispositivo ? 'input-error' : ''}>
                                <option value="" disabled>Selecciona...</option>
                                <option value="notebook">Notebook</option>
                                <option value="pc">PC Escritorio</option>
                                <option value="consola">Consola</option>
                                <option value="celular">Celular</option>
                                <option value="tablet">Tablet</option>
                                <option value="otro">Otro</option>
                            </select>
                            {errors.dispositivo && <span className="msg-error">{errors.dispositivo}</span>}
                        </div>

                        <div className="input-group">
                            <label htmlFor="fecha">Fecha</label>
                            <input type="date" id="fecha" name="fecha" min={today} value={formData.fecha} onChange={handleChange} className={errors.fecha ? 'input-error' : ''}/>
                            {errors.fecha && <span className="msg-error">{errors.fecha}</span>}
                        </div>

                        <div className="input-group full-width">
                            <label htmlFor="mensaje">Descripción del Problema</label>
                            
                            <div className="editor-container" style={{ backgroundColor: 'white', color: 'black', borderRadius: '4px' }}>
                                <ReactQuill 
                                    theme="snow"
                                    value={formData.mensaje}
                                    onChange={(value) => setFormData({ ...formData, mensaje: value })}
                                    modules={modules}
                                    placeholder="Describe el problema. Puedes pegar imágenes aquí..."
                                />
                            </div>

                            {errors.mensaje && <span className="msg-error" style={{ display:'block', marginTop:'5px' }}>{errors.mensaje}</span>}
                        </div>

                        <div className="input-group full-width">
                            <button type="submit" className="btn-confirmar" disabled={status?.type === 'info'}>
                                {status?.type === 'info' ? "Enviando..." : "Confirmar Cita"}
                            </button>
                        </div>

                    </form>
                </div>
            </section>
        </main>
    );
};

export default ServicioTecnico;