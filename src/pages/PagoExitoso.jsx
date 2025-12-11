import { Link, useLocation } from 'react-router-dom';

const PagoExitoso = () => {
    const location = useLocation();
    const { orderId, total, items, buyer } = location.state || {};

    if (!orderId) {
        return (
            <main className="checkout-page" style={{textAlign: 'center', padding: '50px'}}>
                <h2>No hay orden activa</h2>
                <Link to="/" className="btn-pagar" style={{display: 'inline-block', width: '200px', textDecoration: 'none'}}>Volver al Inicio</Link>
            </main>
        );
    }

    return (
        <main className="checkout-page">
            <div className="checkout-resumen" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <i className="fa-solid fa-circle-check" style={{ fontSize: '4rem', color: '#38a1ee' }}></i>
                    <h1 style={{ color: '#333', marginTop: '10px' }}>¡Compra Exitosa!</h1>
                    <p>Orden #{orderId}</p>
                </div>

                <div className="info-bloque">
                    <h3>📋 Datos del Cliente</h3>
                    <p><strong>Nombre:</strong> {buyer.nombre}</p>
                    <p><strong>Email:</strong> {buyer.email}</p>
                    
                    <p><strong>Dirección:</strong> {buyer.calle} #{buyer.numero}, {buyer.comuna}</p>
                    <p><strong>Región:</strong> {buyer.region}</p>
                </div>

                <div className="info-bloque">
                    <h3>🛒 Resumen de Productos</h3>
                    {items.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}>
                            <span>{item.nombre} (x{item.quantity})</span>
                            <span>${(item.precio * item.quantity).toLocaleString()}</span>
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '20px', color: '#38a1ee' }}>
                        <span>Total Pagado:</span>
                        <span>${total.toLocaleString()}</span>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <p style={{ marginBottom: '20px', color: '#666' }}>Te hemos enviado un correo con los detalles.</p>
                    <Link to="/" className="btn-pagar" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '15px 40px' }}>
                        Volver a la Tienda
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default PagoExitoso;