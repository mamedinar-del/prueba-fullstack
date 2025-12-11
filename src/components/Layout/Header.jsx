import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

import logoImage from '/assets/img/LogoTienda-SinFondo.png'; 

const Header = () => {
    const { user, logout } = useAuth();
    const { toggleCart, cartCount } = useCart();
    const navigate = useNavigate();
    
    const [termino, setTermino] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (termino.trim()) {
            navigate(`/productos?q=${termino}`);
            setTermino("");
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/');
    };

    return (
        <header className="header-principal">
            <div className="logo-container">
                <Link to="/">
                    <img src={logoImage} alt="Logo Level-Up" className="mi-logo" /> 
                </Link>
            </div>

            <div className="buscador-container">
                <form onSubmit={handleSearch} className="search-box">
                    <input 
                        type="text" 
                        placeholder="Buscar productos..." 
                        value={termino}
                        onChange={(e) => setTermino(e.target.value)}
                    />
                    <button type="submit">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </form>
            </div>

            <div className="acciones-usuario">
                <div className="dropdown">
                    <button className="dropbtn">
                        <i className="fa-solid fa-user"></i> {user ? `Hola, ${user.nombre}` : "Mi Cuenta"} <i className="fa-solid fa-caret-down"></i>
                    </button>
                    <div className="dropdown-content">
                        {user ? (
                            <>
                                {user.role === 'ADMIN' && (
                                    <Link to="/admin" style={{color:'#e67e22'}}>Panel Admin</Link>
                                )}
                                <Link to="/mi-perfil">Mi Perfil</Link>
                                <Link to="/mis-pedidos">Mis Pedidos</Link>
                                <a href="#" onClick={handleLogout} style={{color:'#ff4757'}}>Cerrar Sesión</a>
                            </>
                        ) : (
                            <>
                                <Link to="/login">Iniciar Sesión</Link>
                                <Link to="/register">Registrarse</Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="carrito-container">
                    <button className="btn-carrito" onClick={toggleCart} style={{background:'none', border:'none', cursor:'pointer'}}>
                        <i className="fa-solid fa-cart-shopping"></i> 
                        <span className="contador">{cartCount}</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;