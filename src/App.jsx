import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Layout/Header';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import CartMenu from './components/Features/CartMenu';
import ScrollToTop from './components/ScrollArriba';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import Productos from './pages/Productos';
import DetalleProducto from './pages/DetalleProducto';
import SobreNosotros from './pages/SobreNosotros';
import Checkout from './pages/Checkout';
import Envios from './pages/Envios';
import ServicioTecnico from './pages/ServicioTecnico';
import Blog from './pages/Blog';
import PagoExitoso from './pages/PagoExitoso';
import PagoFallido from './pages/PagoFallido';
import ScrollArriba from './components/ScrollArriba';
import CitaConfirmacion from './pages/CitaConfirmacion';
import MiPerfil from './pages/MiPerfil';
import MisPedidos from './pages/MisPedidos';

const Layout = ({ children }) => {
    const location = useLocation();
    const isHidden = location.pathname === '/admin';
    return (
        <>
            {!isHidden && <Header />}
            {!isHidden && <Navbar />}
            {children}
            {!isHidden && <Footer />}
            <CartMenu />
        </>
    );
};

function App() {
  return (
    <AuthProvider>
        <CartProvider>
            <BrowserRouter>
                <ScrollArriba />
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/admin" element={<AdminPanel />} />
                        <Route path="/productos" element={<Productos />} />
                        <Route path="/producto/:id" element={<DetalleProducto />} />
                        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/envios" element={<Envios />} />
                        <Route path="/servicio-tecnico" element={<ServicioTecnico />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/pago-exitoso" element={<PagoExitoso />} />
                        <Route path="/pago-fallido" element={<PagoFallido />} />
                        <Route path="/cita-confirmacion" element={<CitaConfirmacion />} />
                        <Route path="/mi-perfil" element={<MiPerfil />} />
                        <Route path="/mis-pedidos" element={<MisPedidos />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </CartProvider>
    </AuthProvider>
  );
}

export default App;