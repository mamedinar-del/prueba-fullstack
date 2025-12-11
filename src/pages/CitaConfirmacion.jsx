import { Link, useLocation } from 'react-router-dom';

const CitaConfirmacion = () => {
    const location = useLocation();
    const { cita } = location.state || {};

    if (!cita) {
        return (
            <main className="checkout-page" style={{textAlign: 'center', padding: '50px'}}>
                <h2>No hay información de cita</h2>
                <Link to="/servicio-tecnico" className="btn-pagar" style={{display: 'inline-block', width: 'auto', padding: '10px 30px', textDecoration: 'none'}}>
                    Ir a Servicio Técnico
                </Link>
            </main>
        );
    }

    return (
        <main className="checkout-page">
            <div className="checkout-resumen" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <i className="fa-solid fa-calendar-check" style={{ fontSize: '4rem', color: '#38a1ee' }}></i>
                    <h1 style={{ color: '#333', marginTop: '10px' }}>¡Solicitud Recibida!</h1>
                    <p>Hemos registrado tu solicitud de servicio técnico.</p>
                </div>

                <div className="info-bloque">
                    <h3>Resumen de la Cita</h3>
                    <p><strong>Cliente:</strong> {cita.nombre}</p>
                    <p><strong>Contacto:</strong> {cita.telefono} | {cita.email}</p>
                    <hr style={{margin: '15px 0', border: '0', borderTop: '1px solid #eee'}}/>
                    <p><strong>Equipo:</strong> {cita.dispositivo.charAt(0).toUpperCase() + cita.dispositivo.slice(1)}</p>
                    <p><strong>Fecha Preferida:</strong> {cita.fecha}</p>
                    
                    <div style={{marginTop: '15px', background: '#f9f9f9', padding: '15px', borderRadius: '8px'}}>
                        <strong>Detalle del problema:</strong>
                        <p style={{margin: '5px 0 0 0', fontStyle: 'italic', color: '#555'}}>"{cita.mensaje}"</p>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <p style={{ marginBottom: '20px', color: '#666', fontSize: '0.9rem' }}>
                        Nuestro equipo técnico revisará tu caso y te contactará al número proporcionado para confirmar el horario exacto.
                    </p>
                    <Link to="/" className="btn-pagar" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '15px 40px' }}>
                        Volver al Inicio
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default CitaConfirmacion;