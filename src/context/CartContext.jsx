import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('levelup_cart');
        return saved ? JSON.parse(saved) : [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);
    
    const [discount, setDiscount] = useState(0);
    const [couponName, setCouponName] = useState("");

    useEffect(() => {
        localStorage.setItem('levelup_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(prev => {
            const exists = prev.find(item => item.id === product.id);
            if (exists) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
    
    const updateQuantity = (id, amount) => {
        setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item));
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);

    const applyCoupon = (code) => {
        if (code === "LEVELUP10") {
            setDiscount(0.10);
            setCouponName(code);
            return true;
        }
        return false;
    };

    const clearCart = () => {
        setCart([]);
        setDiscount(0);
        setCouponName("");
    };
    
    const cartSubtotal = cart.reduce((acc, item) => acc + (item.precio * item.quantity), 0);
    const cartTotal = Math.round(cartSubtotal - (cartSubtotal * discount));

    return (
        <CartContext.Provider value={{ 
            cart, isCartOpen, addToCart, removeFromCart, updateQuantity, 
            clearCart, toggleCart, cartSubtotal, cartTotal, 
            cartCount: cart.reduce((acc, item) => acc + item.quantity, 0),
            applyCoupon, discount, couponName 
        }}>
            {children}
        </CartContext.Provider>
    );
};