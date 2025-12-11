import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { actualizarUsuarioAPI } from '../services/dataService';

const MiPerfil = () => {
    const { user, updateUser } = useAuth();
    const [mensaje, setMensaje] = useState(null);

    const [formData, setFormData] = useState({
        region: '', comuna: '', calle: '', numero: '', depto: ''
    });

    const regionesChile = [
        { id: "AP", nombre: "Arica y Parinacota" }, { id: "TA", nombre: "Tarapacá" }, { id: "AN", nombre: "Antofagasta" }, { id: "AT", nombre: "Atacama" }, { id: "CO", nombre: "Coquimbo" }, { id: "VA", nombre: "Valparaíso" }, { id: "RM", nombre: "Metropolitana" }, { id: "LI", nombre: "O'Higgins" }, { id: "ML", nombre: "Maule" }, { id: "NB", nombre: "Ñuble" }, { id: "BI", nombre: "Biobío" }, { id: "AR", nombre: "Araucanía" }, { id: "LR", nombre: "Los Ríos" }, { id: "LL", nombre: "Los Lagos" }, { id: "AI", nombre: "Aysén" }, { id: "MA", nombre: "Magallanes" }
    ];

    useEffect(() => {
        if (user) {
            setFormData({
                region: user.region || '',
                comuna: user.comuna || '',
                calle: user.calle || '',
                numero: user.numero || '',
                depto: user.depto || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ text: "Guardando...", type: "info" });

        try {
            const usuarioActualizado = await actualizarUsuarioAPI(user.id, formData);
            
            updateUser(usuarioActualizado);
            
            setMensaje({ text: "¡Dirección actualizada correctamente!", type: "success" });
        } catch (error) {
            setMensaje({ text: "Error al guardar: " + error.message, type: "error" });
        }
    };

    if (!user) return <div style={{padding:50, textAlign:'center'}}>Debes iniciar sesión.</div>;

    return (
        <main className="login-bg">
            <div className="register-card" style={{maxWidth: '800px', margin: '0 auto'}}>
                <div className="card-header">
                    <h2><i className="fa-solid fa-id-card"></i> Mi Perfil</h2>
                    <p>Hola, <strong>{user.nombre}</strong>. Aquí puedes gestionar tus datos de envío.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <h3 style={{color: '#38a1ee', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px'}}>
                        <i className="fa-solid fa-truck-fast"></i> Dirección de Envío
                    </h3>

                    <div className="input-wrapper">
                        <label htmlFor="region">Región</label>
                        <div className="input-icon-box"><i className="fa-solid fa-map icon-input"></i>
                            <select id="region" name="region" value={formData.region} onChange={handleChange} required>
                                <option value="" disabled>Selecciona una región</option>
                                {regionesChile.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <label htmlFor="comuna">Comuna</label>
                        <div className="input-icon-box"><i className="fa-solid fa-map-pin icon-input"></i><input id="comuna" type="text" name="comuna" value={formData.comuna} onChange={handleChange} required /></div>
                    </div>

                    <div className="form-row">
                        <div className="input-wrapper" style={{flex: 2}}>
                            <label htmlFor="calle">Calle</label>
                            <div className="input-icon-box"><i className="fa-solid fa-road icon-input"></i><input id="calle" type="text" name="calle" value={formData.calle} onChange={handleChange} required /></div>
                        </div>
                        <div className="input-wrapper" style={{flex: 1}}>
                            <label htmlFor="numero">Número</label>
                            <div className="input-icon-box"><i className="fa-solid fa-hashtag icon-input"></i><input id="numero" type="text" name="numero" value={formData.numero} onChange={handleChange} required /></div>
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <label htmlFor="depto">Depto / Casa (Opcional)</label>
                        <div className="input-icon-box"><i className="fa-solid fa-building icon-input"></i><input id="depto" type="text" name="depto" value={formData.depto} onChange={handleChange} /></div>
                    </div>

                    {mensaje && (
                        <div className={`alert ${mensaje.type === 'success' ? 'alert-success' : 'alert-danger'}`} 
                             style={{padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center', 
                             backgroundColor: mensaje.type === 'success' ? '#d4edda' : '#f8d7da', 
                             color: mensaje.type === 'success' ? '#155724' : '#721c24'}}>
                            {mensaje.text}
                        </div>
                    )}

                    <button type="submit" className="btn-login">Guardar Cambios</button>
                </form>
            </div>
        </main>
    );
};

export default MiPerfil;