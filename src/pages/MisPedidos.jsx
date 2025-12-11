import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMisPedidosAPI } from '../services/dataService';

const MisPedidos = () => {
    const { user } = useAuth();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    const getImageUrl = (imgName) => {
        const base = import.meta.env.BASE_URL; 
        const fallback = `${base}assets/img/ps5-caja.png`;
        
        if (!imgName) return fallback;
        if (imgName.startsWith("http")) return imgName;
        
        if (imgName.startsWith("/assets")) {
             return `${base.replace(/\/$/, '')}${imgName}`;
        }
        
        return `http://localhost:8080/api/productos/images/${imgName}`;
    };

    useEffect(() => {
        if (user) {
            cargarPedidos();
        }
    }, [user]);

    const cargarPedidos = async () => {
        try {
            const data = await getMisPedidosAPI(user.id);
            
            console.log("Datos recibidos del Backend:", data);

            setPedidos(data.sort((a, b) => b.id - a.id));
        } catch (error) {
            console.error("Error al cargar pedidos:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="msg-container">Inicia sesión para ver tus pedidos.</div>;
    if (loading) return <div className="msg-container">Cargando historial...</div>;

    return (
        <main className="catalogo-page">
            <div className="container" style={{maxWidth: '900px', margin: '40px auto'}}>
                
                <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'30px', borderBottom:'2px solid #eee', paddingBottom:'15px'}}>
                    <i className="fa-solid fa-box-open" style={{fontSize:'2rem', color:'#38a1ee'}}></i>
                    <h2 style={{margin:0, color:'#333'}}>Mis Pedidos</h2>
                </div>

                {pedidos.length === 0 ? (
                    <div className="estado-vacio">
                        <i className="fa-solid fa-receipt"></i>
                        <h3>Aún no tienes compras</h3>
                        <Link to="/productos" className="btn-agregar" style={{textDecoration:'none', display:'inline-block', width:'auto', marginTop:'15px'}}>
                            Ir a la Tienda
                        </Link>
                    </div>
                ) : (
                    <div className="lista-pedidos">
                        {pedidos.map(pedido => (
                            <div key={pedido.id} className="card shadow-sm mb-5 border-0" style={{borderRadius: '12px', overflow:'hidden'}}>
                                
                                <div className="card-header bg-light d-flex justify-content-between align-items-center py-3 px-4" 
                                     style={{borderBottom:'1px solid #eee'}}>
                                    <div>
                                        <h5 style={{margin:0, fontWeight:'bold', color:'#555'}}>Orden #{pedido.id}</h5>
                                        <small className="text-muted">
                                            <i className="fa-regular fa-calendar"></i> {new Date(pedido.fecha).toLocaleDateString()} &nbsp; | &nbsp; 
                                            <i className="fa-regular fa-clock"></i> {new Date(pedido.fecha).toLocaleTimeString()}
                                        </small>
                                    </div>
                                    <span className="badge" style={{backgroundColor:'#27ae60', color:'white', padding:'8px 15px', borderRadius:'20px'}}>
                                        {pedido.estado}
                                    </span>
                                </div>

                                <div className="card-body p-0">
                                    {pedido.detalles && pedido.detalles.map(detalle => (
                                        <div key={detalle.id} className="d-flex align-items-center p-3 border-bottom hover-bg" style={{transition:'0.2s'}}>
                                            
                                            <Link to={`/producto/${detalle.producto.id}`}>
                                                <img 
                                                    src={getImageUrl(detalle.producto.img)} 
                                                    alt={detalle.producto.nombre} 
                                                    style={{width: '80px', height: '80px', objectFit: 'contain', borderRadius: '8px', border:'1px solid #f0f0f0'}}
                                                    onError={(e) => e.target.src = getImageUrl(null)}
                                                />
                                            </Link>

                                            <div className="ms-3 flex-grow-1" style={{paddingLeft: '20px'}}>
                                                <Link to={`/producto/${detalle.producto.id}`} style={{textDecoration:'none', color:'#333'}}>
                                                    <h6 style={{margin: '0 0 5px 0', fontSize:'1.1rem', fontWeight:'bold'}}>{detalle.producto.nombre}</h6>
                                                </Link>
                                                <p style={{margin:0, color:'#777', fontSize:'0.9rem'}}>
                                                    {detalle.producto.categoria}
                                                </p>
                                            </div>

                                            <div className="text-end" style={{minWidth: '120px'}}>
                                                <div style={{fontSize:'0.9rem', color:'#888'}}>
                                                    {detalle.cantidad} x ${detalle.precioUnitario.toLocaleString()}
                                                </div>
                                                <div style={{fontWeight:'bold', color:'#333', fontSize:'1.1rem'}}>
                                                    {(detalle.cantidad * detalle.precioUnitario).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="card-footer bg-white py-3 px-4 d-flex justify-content-between align-items-center">
                                    <span style={{color:'#888'}}>Método de pago: <strong>Webpay</strong></span>
                                    <div style={{textAlign:'right'}}>
                                        <span style={{display:'block', fontSize:'0.9rem', color:'#888'}}>Total Pagado</span>
                                        <span style={{fontSize:'1.5rem', fontWeight:'bold', color:'#38a1ee'}}>
                                            ${pedido.total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default MisPedidos;