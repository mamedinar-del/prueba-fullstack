import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { crearPedidoAPI } from '../services/dataService';

const Checkout = () => {
    const { user, updateUser } = useAuth();
    const { cart, cartTotal, cartSubtotal, discount, couponName, applyCoupon, clearCart } = useCart();
    const navigate = useNavigate();
    
    const [inputCupon, setInputCupon] = useState("");
    const [msgCupon, setMsgCupon] = useState("");
    const [direccionForm, setDireccionForm] = useState({ region: '', comuna: '', calle: '', numero: '', depto: '' });

    const tieneDireccion = user?.calle && user?.numero && user?.comuna;

    const getImageUrl = (imgName) => {
        if (!imgName) return "/assets/img/ps5-caja.png";
        if (imgName.startsWith("http") || imgName.startsWith("/assets")) return imgName;
        return `http://localhost:8080/api/productos/images/${imgName}`;
    };

    const handleApplyCoupon = () => {
        if (applyCoupon(inputCupon.toUpperCase())) setMsgCupon("Aplicado");
        else setMsgCupon("Inválido");
    };

    const handleSaveAddress = (e) => {
        e.preventDefault();
        updateUser(direccionForm);
    };

    const handlePayment = async () => {
        try {
            const orden = await crearPedidoAPI(user.id, cart, couponName);
            clearCart();
            navigate('/pago-exitoso', { state: { orderId: orden.id, total: cartTotal, items: cart, buyer: user } });
        } catch (error) { navigate('/pago-fallido'); }
    };

    if (!user) return <div style={{textAlign:'center', padding:50}}><h2>Inicia sesión para comprar</h2></div>;
    
    if (cart.length === 0) return <div style={{textAlign:'center', padding:50}}><h2>Carrito vacío</h2></div>;

    if (!tieneDireccion) {
        return (
            <main className="login-bg">
                <div className="login-container">
                    <h2>Falta tu Dirección</h2> 
                    <p style={{marginBottom:'20px', color:'#666'}}>Necesitamos tus datos de envío.</p>
                    
                    <form onSubmit={handleSaveAddress} className="login-form">
                        <div className="input-wrapper"><label>Región</label><div className="input-icon-box"><input onChange={e=>setDireccionForm({...direccionForm, region:e.target.value})} required /></div></div>
                        <div className="input-wrapper"><label>Comuna</label><div className="input-icon-box"><input onChange={e=>setDireccionForm({...direccionForm, comuna:e.target.value})} required /></div></div>
                        <div className="form-row">
                            <div className="input-wrapper"><label>Calle</label><div className="input-icon-box"><input onChange={e=>setDireccionForm({...direccionForm, calle:e.target.value})} required /></div></div>
                            <div className="input-wrapper"><label>Número</label><div className="input-icon-box"><input onChange={e=>setDireccionForm({...direccionForm, numero:e.target.value})} required /></div></div>
                        </div>
                        <button className="btn-login">Guardar y Continuar</button>
                    </form>
                </div>
            </main>
        );
    }

    return (
        <main className="checkout-page">
            <div className="checkout-grid">
                <div className="checkout-info">
                    <h2>Finalizar Compra</h2>
                    <div className="info-bloque">
                        <h3>Datos de Envío</h3>
                        <p>{user.nombre}</p>
                        <p>{user.calle} #{user.numero}, {user.comuna}</p>
                        <button onClick={() => updateUser({calle: ''})} style={{background:'none', border:'none', color:'blue', cursor:'pointer', textDecoration:'underline'}}>Cambiar dirección</button>
                    </div>
                </div>
                <div className="checkout-resumen">
                    <h3>Resumen del Pedido</h3>
                    {cart.map(i => (
                        <div key={i.id} style={{display:'flex', justifyContent:'space-between', marginBottom:10}}>
                            <span>{i.nombre} x{i.quantity}</span><span>${(i.precio*i.quantity).toLocaleString()}</span>
                        </div>
                    ))}
                    <div style={{margin:'15px 0', display:'flex', gap:5}}>
                        <input value={inputCupon} onChange={e=>setInputCupon(e.target.value)} placeholder="Cupón" />
                        <button onClick={handleApplyCoupon}>Aplicar</button>
                    </div>
                    {msgCupon && <small>{msgCupon}</small>}
                    <hr/>
                    <div style={{display:'flex', justifyContent:'space-between'}}><span>Total</span><strong>${cartTotal.toLocaleString()}</strong></div>
                    <button className="btn-pagar" onClick={handlePayment}>Pagar Ahora</button>
                </div>
            </div>
        </main>
    );
};

export default Checkout;