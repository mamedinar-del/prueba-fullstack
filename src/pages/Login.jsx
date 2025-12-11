import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginAPI } from '../services/dataService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errorMsg, setErrorMsg] = useState('');
    
    const { loginSuccess } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            const response = await loginAPI(email, password);
            loginSuccess(response);
            if (response.usuario.role === 'ADMIN') navigate('/admin');
            else navigate('/');
        } catch (err) {
            setErrorMsg('Credenciales incorrectas o usuario no encontrado.');
        }
    };

    return (
        <main className="login-bg">
            <div className="login-container">
                <div className="login-header"><h2>¡Hola de nuevo! 👋</h2><p>Ingresa tus datos</p></div>
                
                {errorMsg && <div className="notification-box notify-error">{errorMsg}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-wrapper"><label>Correo</label><div className="input-icon-box"><i className="fa-solid fa-envelope icon-input"></i><input type="text" value={email} onChange={e=>setEmail(e.target.value)} required /></div></div>
                    <div className="input-wrapper"><label>Contraseña</label><div className="input-icon-box"><i className="fa-solid fa-lock icon-input"></i><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></div></div>
                    <button type="submit" className="btn-login">Iniciar Sesión</button>
                </form>
                <div className="login-footer"><p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p></div>
            </div>
        </main>
    );
};
export default Login;