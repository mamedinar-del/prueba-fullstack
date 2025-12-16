import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductos, getImagenUrl } from '../services/dataService';
import { useCart } from '../context/CartContext';

const DetalleProducto = () => {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [imagenActiva, setImagenActiva] = useState('');
    const [activeTab, setActiveTab] = useState('descripcion'); 
    const [cantidad, setCantidad] = useState(1);
    
    const { addToCart } = useCart();


    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const todos = await getProductos(); 
                if (Array.isArray(todos)) {
                    const encontrado = todos.find(p => p.id === parseInt(id));
                    if (encontrado) {
                        setProducto(encontrado);
                        console.log("Nombre de archivo esperado:", encontrado.img);
                        setImagenActiva(encontrado.img); 
                    }
                }
            } catch (error) {
                console.error("Error cargando producto:", error);
            }
        };
        cargarDatos();
    }, [id]);

    if (!producto) return <div style={{padding:50, textAlign:'center'}}>Cargando producto...</div>;

    const handleAddToCart = () => {
        for(let i = 0; i < cantidad; i++) {
            addToCart(producto);
        }
        alert("Producto agregado al carrito");
    };

    const specsObj = producto.specs ? JSON.parse(producto.specs) : {};

    return (
        <main className="detalle-page">
            <div className="container">
                <nav className="breadcrumb">
                    <Link to="/">Inicio</Link> / 
                    <Link to={`/productos?q=${producto.categoria}`}> {producto.categoria}</Link> / 
                    <span> {producto.nombre}</span>
                </nav>
            </div>

            <div className="container detalle-grid">
                
                <div className="galeria-container">
                    <div className="imagen-principal">
                        <img 
                            src={getImagenUrl(imagenActiva)} 
                            alt={producto.nombre} 
                            onError={(e) => e.target.src = getImagenUrl(null)}
                        />
                    </div>
                    {producto.galeria && (
                        <div className="miniaturas-strip">
                             <img 
                                src={getImagenUrl(producto.img)} 
                                className="active" 
                                alt="Miniatura" 
                                onClick={() => setImagenActiva(producto.img)}
                             />
                        </div>
                    )}
                </div>


                <div className="info-container">
                    <p className="marca-sku">COD: {producto.id} | Categoría: {producto.categoria}</p>
                    <h1 style={{fontSize: '2.2rem', marginBottom: '10px'}}>{producto.nombre}</h1>
                    
                    <div className="precio-stock-box" style={{borderBottom: 'none', paddingBottom: '10px', marginBottom: '10px'}}>
                        <h2 className="precio-final" style={{color: '#38a1ee', fontSize: '2.5rem'}}>
                            ${producto.precio.toLocaleString()}
                        </h2>
                    </div>

                    <div className="payment-options">
                        <p className="cuotas-text"><i className="fa-regular fa-credit-card"></i> Hasta <strong>12 cuotas sin interés</strong> de ${(Math.round(producto.precio/12)).toLocaleString()}</p>
                        <div className="payment-icons">
                            <i className="fa-brands fa-cc-visa" title="Visa"></i>
                            <i className="fa-brands fa-cc-mastercard" title="Mastercard"></i>
                            <i className="fa-brands fa-cc-amex" title="Amex"></i>
                            <span className="payment-text">Webpay Plus</span>
                        </div>
                    </div>

                    <div className="stock-info">
                        {producto.stock > 0 ? (
                            <div className="stock-status in-stock">
                                <i className="fa-solid fa-check-circle"></i> 
                                <span>Stock Disponible: <strong>{producto.stock} unidades</strong></span>
                            </div>
                        ) : (
                            <div className="stock-status out-stock">
                                <i className="fa-solid fa-circle-xmark"></i> 
                                <span>Producto Agotado</span>
                            </div>
                        )}
                    </div>

                    <div 
                        className="descripcion-html"
                        dangerouslySetInnerHTML={{ __html: producto.descripcion }} 
                    />

                    {producto.stock > 0 && (
                        <div className="acciones-compra">
                            <div className="selector-cantidad">
                                <button onClick={() => setCantidad(c => Math.max(1, c - 1))}>-</button>
                                <input type="text" value={cantidad} readOnly />
                                <button onClick={() => setCantidad(c => Math.min(producto.stock, c + 1))}>+</button>
                            </div>
                            <button className="btn-comprar" onClick={handleAddToCart}>
                                Añadir al Carrito
                            </button>
                        </div>
                    )}

                    <div className="beneficios-extra-grid">
                        <div className="beneficio-mini">
                            <i className="fa-solid fa-truck-fast"></i>
                            <div>
                                <strong>Envío a todo Chile</strong>
                                <small>Calculado en el checkout</small>
                            </div>
                        </div>
                        <div className="beneficio-mini">
                            <i className="fa-solid fa-shield-halved"></i>
                            <div>
                                <strong>Compra Protegida</strong>
                                <small>Garantía de 6 meses</small>
                            </div>
                        </div>
                        <div className="beneficio-mini">
                            <i className="fa-solid fa-rotate-left"></i>
                            <div>
                                <strong>Devolución Gratis</strong>
                                <small>Tienes 30 días</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container tabs-section">
                <div className="tabs-header">
                    <button className={activeTab==='descripcion'?'active':''} onClick={()=>setActiveTab('descripcion')}>Descripción</button>
                    <button className={activeTab==='specs'?'active':''} onClick={()=>setActiveTab('specs')}>Especificaciones</button>
                </div>
                <div className="tabs-content">
                    {activeTab === 'descripcion' && (
                        <div 
                            className="descripcion-html" 
                            style={{lineHeight: '1.6', color: '#555'}}
                            dangerouslySetInnerHTML={{ __html: producto.descripcion }}
                        />
                    )}
                    
                    {activeTab === 'specs' && (
                        <div className="tab-pane">
                            <h3>Ficha Técnica</h3>
                            {Object.keys(specsObj).length > 0 ? (
                                <table className="specs-table">
                                    <tbody>
                                        {Object.entries(specsObj).map(([key, val]) => (
                                            <tr key={key}><th>{key}</th><td>{val}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : <p>No hay especificaciones detalladas.</p>}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default DetalleProducto;