import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerAPI } from '../services/dataService';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '', apellido: '', rut: '', telefono: '',
        email: '', password: '', confirmPassword: '', 
        region: '', comuna: '', calle: '', numero: '', depto: '', terminos: false
    });
    const [errors, setErrors] = useState({});
    
    const [feedback, setFeedback] = useState(null); 

    const regionesChile = [{ id: "AP", nombre: "Arica y Parinacota" }, { id: "RM", nombre: "Metropolitana" }, { id: "VA", nombre: "Valparaíso" }];

    const validarRut = (rut) => {
        const valor = rut.replace(/\./g, '').replace(/-/g, '');
        if (valor.length < 8) return false;
        const cuerpo = valor.slice(0, -1);
        const dv = valor.slice(-1).toUpperCase();
        if (!/^[0-9]+$/.test(cuerpo)) return false;
        let suma = 0, multiplo = 2;
        for (let i = 1; i <= cuerpo.length; i++) {
            const index = multiplo * valor.charAt(cuerpo.length - i);
            suma = suma + index;
            if (multiplo < 7) { multiplo = multiplo + 1; } else { multiplo = 2; }
        }
        const dvEsperado = 11 - (suma % 11);
        let dvCalculado = (dvEsperado === 11) ? "0" : (dvEsperado === 10) ? "K" : dvEsperado.toString();
        return dv === dvCalculado;
    };

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidChileanPhone = (phone) => {
        const cleanPhone = phone.replace(/\s/g, '').replace('+', '');
        if (cleanPhone.length === 9 && cleanPhone.startsWith('9')) return true;
        if (cleanPhone.length === 11 && cleanPhone.startsWith('569')) return true;
        return false;
    };
    const isSecurePassword = (pw) => /[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[!@#$%^&*]/.test(pw) && pw.length >= 8;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const valor = type === 'checkbox' ? checked : value;
        if (name === 'telefono' && value !== '' && !/^[0-9\s+]+$/.test(value)) return;
        setFormData({ ...formData, [name]: valor });
        if (errors[name]) setErrors({ ...errors, [name]: '' });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setFeedback(null);
        const newErrors = {};

        if (!formData.nombre.trim()) newErrors.nombre = "Nombre obligatorio.";
        if (!formData.rut.trim()) newErrors.rut = "RUT obligatorio.";
        else if (!validarRut(formData.rut)) newErrors.rut = "RUT inválido.";
        if (!formData.telefono.trim()) newErrors.telefono = "Teléfono obligatorio.";
        else if (!isValidChileanPhone(formData.telefono)) newErrors.telefono = "Formato inválido.";
        if (!formData.email.trim()) newErrors.email = "Email obligatorio.";
        else if (!isValidEmail(formData.email)) newErrors.email = "Email inválido.";
        if (!isSecurePassword(formData.password)) newErrors.password = "Mín 8 chars, Mayúscula, Número y Símbolo.";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "No coinciden.";
        if (!formData.terminos) newErrors.terminos = "Debes aceptar términos.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await registerAPI(formData);
            setFeedback({ type: 'success', msg: '¡Cuenta creada con éxito! Redirigiendo...' });
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setFeedback({ type: 'error', msg: "Error: " + error.message });
        }
    };

    return (
        <main className="login-bg">
            <form className="register-layout" onSubmit={handleRegister} style={{justifyContent:'center'}}>
                <div className="register-card" style={{maxWidth:'600px', width:'100%'}}>
                    <div className="card-header">
                        <h2><i className="fa-solid fa-user-plus"></i> Crear Cuenta</h2>
                        <p>Únete a Level-Up Store</p>
                    </div>

                    {feedback && (
                        <div className={`notification-box ${feedback.type === 'success' ? 'notify-success' : 'notify-error'}`}>
                            {feedback.msg}
                        </div>
                    )}

                    <div className="form-row">
                        <div className="input-wrapper"><label>Nombre *</label><div className="input-icon-box"><i className="fa-solid fa-user icon-input"></i><input name="nombre" placeholder="" onChange={handleChange} className={errors.nombre ? 'input-error' : ''} /></div>{errors.nombre && <span className="msg-error">{errors.nombre}</span>}</div>
                        <div className="input-wrapper"><label>Apellido *</label><div className="input-icon-box"><i className="fa-solid fa-user icon-input"></i><input name="apellido" placeholder="" onChange={handleChange} /></div></div>
                    </div>
                    <div className="form-row">
                        <div className="input-wrapper"><label>RUT *</label><div className="input-icon-box"><i className="fa-solid fa-id-card icon-input"></i><input name="rut" onChange={handleChange} className={errors.rut ? 'input-error' : ''} /></div>{errors.rut && <span className="msg-error">{errors.rut}</span>}</div>
                        <div className="input-wrapper"><label>Teléfono *</label><div className="input-icon-box"><i className="fa-solid fa-phone icon-input"></i><input type="tel" name="telefono" onChange={handleChange} className={errors.telefono ? 'input-error' : ''} /></div>{errors.telefono && <span className="msg-error">{errors.telefono}</span>}</div>
                    </div>
                    <div className="input-wrapper"><label>Correo *</label><div className="input-icon-box"><i className="fa-solid fa-envelope icon-input"></i><input type="email" name="email" onChange={handleChange} className={errors.email ? 'input-error' : ''} /></div>{errors.email && <span className="msg-error">{errors.email}</span>}</div>
                    <div className="form-row">
                        <div className="input-wrapper"><label>Contraseña *</label><div className="input-icon-box"><i className="fa-solid fa-lock icon-input"></i><input type="password" name="password" onChange={handleChange} className={errors.password ? 'input-error' : ''} /></div>{errors.password && <span className="msg-error">{errors.password}</span>}</div>
                        <div className="input-wrapper"><label>Confirmar *</label><div className="input-icon-box"><i className="fa-solid fa-lock icon-input"></i><input type="password" name="confirmPassword" onChange={handleChange} className={errors.confirmPassword ? 'input-error' : ''} /></div>{errors.confirmPassword && <span className="msg-error">{errors.confirmPassword}</span>}</div>
                    </div>

                    <div className="form-footer-action" style={{marginTop:'20px', padding:0, boxShadow:'none'}}>
                        <label className="checkbox-container">
                            <input type="checkbox" name="terminos" onChange={handleChange} /> Acepto los <a href="#">Términos</a>
                        </label>
                        {errors.terminos && <div className="msg-error" style={{marginBottom:'10px'}}>{errors.terminos}</div>}
                        <button type="submit" className="btn-login btn-grande" disabled={feedback?.type === 'success'}>Registrarse</button>
                        <p className="login-link">¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link></p>
                    </div>
                </div>
            </form>
        </main>
    );
};
export default Register;