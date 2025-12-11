import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const CartMenu = () => {
    const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();

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
                                        src={getImageUrl(item.img)} 
                                        alt={item.nombre} 
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