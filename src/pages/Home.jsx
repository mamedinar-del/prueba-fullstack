import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/UI/HeroCarousel';
import { getProductos } from '../services/dataService';
import { useCart } from '../context/CartContext';

import fallbackImage from '/assets/img/ps5-caja.png';
import tecnicoImage from '/assets/img/tecnico.jpg';

const Home = () => {
    const [productos, setProductos] = useState([]);
    const [subscribed, setSubscribed] = useState(false);
    const { addToCart } = useCart();

    const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/';

    useEffect(() => {
        const load = async () => {
            const data = await getProductos();
            setProductos(data);
        };
        load();
    }, []);

    const getImageUrl = (imgName) => {
        const fallback = fallbackImage; 
        if (!imgName) return fallback;
        if (typeof imgName !== 'string') return fallback;
        const trimmed = imgName.trim();
        if (/^https?:\/\//i.test(trimmed)) return trimmed; 
        if (trimmed.startsWith('/assets') || trimmed.startsWith('assets')) {
            return trimmed.startsWith('/') ? `${base.replace(/\/$/, '')}${trimmed}` : `${base}${trimmed}`;
        }
        if (trimmed.startsWith('/api')) return `http://localhost:8080${imgName}`;
        return `http://localhost:8080/api/productos/images/${imgName}`;
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        setSubscribed(true);
    };

    return (
        <main>
            <HeroCarousel />

            <section className="seccion-productos">
                <div style={{
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '30px',
                    paddingBottom: '10px',
                    borderBottom: '2px solid #f0f0f0'
                }}>
                    <h2 className="titulo-seccion" style={{margin: 0, border: 'none', textAlign: 'left'}}>
                        Destacados
                    </h2>
                    
                    <Link to="/productos" style={{
                        color: '#38a1ee', 
                        fontWeight: 'bold', 
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '1.1rem'
                    }}>
                        Ver todo el catálogo <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                </div>

                <div className="grid-productos">
                    {productos.slice(0, 4).map((prod) => {
                        const sinStock = prod.stock <= 0;

                        return (
                            <article className={`card-producto ${sinStock ? 'agotado' : ''}`} key={prod.id}>
                                <div className="contenedor-img">
                                    <Link to={`/producto/${prod.id}`}>
                                        <img 
                                            src={getImageUrl(prod.img || prod.imagen)} 
                                            alt={prod.nombre} 
                                            onError={(e) => e.target.src = fallbackImage} 
                                        />
                                        
                                        {!sinStock && prod.badge && (
                                            <span 
                                                className="badge-oferta" 
                                                style={{ backgroundColor: prod.badgeColor || '#38a1ee' }}
                                            >
                                                {prod.badge}
                                            </span>
                                        )}

                                        {sinStock && (
                                            <div className="overlay-agotado" style={{
                                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                                background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'white', fontWeight: 'bold', letterSpacing: '1px'
                                            }}>
                                                AGOTADO
                                            </div>
                                        )}
                                    </Link>
                                </div>

                                <div className="info-producto">
                                    <h3>
                                        <Link to={`/producto/${prod.id}`} style={{ color: '#333', textDecoration: 'none' }}>
                                            {prod.nombre}
                                        </Link>
                                    </h3>
                                    <p className="descripcion">{prod.categoria}</p>
                                    
                                    <div className="precio-container">
                                        <span className="precio-actual">${prod.precio.toLocaleString()}</span>
                                    </div>
                                    
                                    <button 
                                        className="btn-agregar"
                                        onClick={() => addToCart(prod)}
                                        disabled={sinStock}
                                        style={{
                                            backgroundColor: sinStock ? '#ccc' : '#38a1ee',
                                            cursor: sinStock ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {sinStock ? 'Sin Stock' : 'Añadir al Carrito'}
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="seccion-servicio-tecnico">
                <div className="contenido-servicio">
                    <div className="columna-texto">
                        <h2>Servicio Técnico Especializado</h2>
                        <p>¿Problemas con tus dispositivos? Nuestro equipo de expertos está listo para ayudarte con reparaciones rápidas y confiables.</p>
                        <Link to="/servicio-tecnico" className="btn-servicio">Agenda tu Revisión</Link>
                    </div>
                    <div className="columna-imagen">
                        <img src={tecnicoImage} alt="Taller de reparación" onError={(e) => e.target.style.display = 'none'} />
                    </div>
                </div>
            </section>

            <section className="seccion-newsletter">
                <div className="contenido-newsletter">
                    <h2>¡No te pierdas ninguna oferta!</h2>
                    
                    {subscribed ? (
                        <div className="notification-box notify-success" style={{
                            border: '2px dashed white', 
                            color: 'white', 
                            background: 'rgba(255,255,255,0.1)',
                            marginTop: '20px'
                        }}>
                            <p style={{margin:0, fontSize: '1.2rem'}}>¡Gracias por suscribirte!</p>
                            <p style={{margin:'10px 0 0 0'}}>Tu código de descuento es: <strong style={{fontSize:'1.5rem', color:'#ffeb3b'}}>LEVELUP10</strong></p>
                        </div>
                    ) : (
                        <>
                            <p>Suscríbete y obtén un <strong>10% de descuento</strong> en tu primera compra.</p>
                            <form className="form-newsletter" onSubmit={handleSubscribe}>
                                <input type="email" placeholder="Ingresa tu correo electrónico" required />
                                <button type="submit">Suscribirme</button>
                            </form>
                        </>
                    )}
                </div>
            </section>

            <section className="seccion-beneficios">
                <div className="beneficio-item">
                    <div className="icono"><i className="fa-solid fa-truck-fast"></i></div>
                    <h3>Envíos a todo el país</h3>
                    <p>Recíbelo en la puerta de tu casa.</p>
                </div>
                <div className="beneficio-item">
                    <div className="icono"><i className="fa-solid fa-credit-card"></i></div>
                    <h3>Pago Seguro</h3>
                    <p>Transacciones 100% protegidas.</p>
                </div>
                <div className="beneficio-item">
                    <div className="icono"><i className="fa-solid fa-shield-halved"></i></div>
                    <h3>Garantía Total</h3>
                    <p>6 meses de garantía en todo.</p>
                </div>
                <div className="beneficio-item">
                    <div className="icono"><i className="fa-solid fa-headset"></i></div>
                    <h3>Soporte 24/7</h3>
                    <p>Expertos listos para ayudarte.</p>
                </div>
            </section>
        </main>
    );
};

export default Home;