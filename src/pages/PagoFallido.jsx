import { Link } from 'react-router-dom';

const PagoFallido = () => {
    return (
        <main className="checkout-page">
            <div className="checkout-resumen" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <i className="fa-solid fa-circle-xmark" style={{ fontSize: '4rem', color: '#ff4757', marginBottom: '20px' }}></i>
                <h1 style={{ color: '#333' }}>¡Ups! Algo salió mal</h1>
                <p style={{ color: '#666', margin: '20px 0' }}>
                    No pudimos procesar tu pago. Puede ser un problema con tu tarjeta o conexión.
                    Por favor, intenta nuevamente.
                </p>
                
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <Link to="/checkout" className="btn-pagar" style={{ textDecoration: 'none', background: '#333' }}>
                        Reintentar Pago
                    </Link>
                    <Link to="/" className="btn-pagar" style={{ textDecoration: 'none', background: '#fff', color: '#333', border: '1px solid #ddd' }}>
                        Cancelar
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default PagoFallido;