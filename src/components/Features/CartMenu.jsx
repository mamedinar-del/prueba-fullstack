import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

// No necesitamos importar la imagen directamente si usamos la ruta dinámica con BASE_URL, 
// pero mantendremos la importación si la quieres usar como un recurso importado para el fallback.
// import ps5CajaFallback from '/assets/img/ps5-caja.png'; 

const CartMenu = () => {
    const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();

    // 💡 FUNCIÓN AÑADIDA: Lógica robusta para manejar rutas de imágenes del backend y assets locales
    const getImageUrl = (imgName) => {
        // Obtiene el prefijo de ruta de Vite (ej: /FullStack-II/)
        const base = import.meta.env.BASE_URL; 
        const fallback = `${base}assets/img/ps5-caja.png`; // El fallback ahora usa la ruta base correcta.
        
        if (!imgName) return fallback;
        if (imgName.startsWith("http")) return imgName;
        
        // Si el path es un asset local (útil si guardas el path completo), le aplica la BASE_URL
        if (imgName.startsWith("/assets")) {
             return `${base.replace(/\/$/, '')}${imgName}`;
        }
        
        // Ruta del Backend (Para la imagen real del producto)
        return `http://localhost:8080/api/productos/images/${imgName}`;
    };

    return (
        <>
            <div 
                className={`cart-overlay ${isCartOpen ? 'open' : ''}`} 
                onClick={toggleCart}
            ></div>

            <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h3>Tu Carrito</h3>
                    <button className="btn-close" onClick={toggleCart}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="cart-items">
                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <i className="fa-solid fa-basket-shopping"></i>
                            <p>Tu carrito está vacío</p>
                            <button className="btn-seguir" onClick={toggleCart}>Seguir comprando</button>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div className="cart-item" key={item.id}>
                                <div className="cart-item-img">
                                    <img 
                                        // 💡 Usamos la función getImageUrl para construir la URL correcta
                                        src={getImageUrl(item.img)} 
                                        alt={item.nombre} 
                                        // Usar getImageUrl(null) asegura que el fallback usa BASE_URL
                                        onError={(e) => e.target.src = getImageUrl(null)}
                                    />
                                </div>
                                <div className="cart-item-info">
                                    <h4>{item.nombre}</h4>
                                    <p className="item-price">${item.precio.toLocaleString()}</p>
                                    <div className="item-controls">
                                        <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                                    </div>
                                </div>
                                <button 
                                    className="btn-remove" 
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart-footer">
                        <div className="total-row">
                            <span>Total:</span>
                            <span className="total-price">${cartTotal.toLocaleString()}</span>
                        </div>
                        <Link to="/checkout" className="btn-checkout" onClick={toggleCart}>
                            Finalizar Compra
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartMenu;