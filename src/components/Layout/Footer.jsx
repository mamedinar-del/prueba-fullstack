import { Link } from 'react-router-dom';

const Footer = () => {
    const BASE_URL = import.meta.env.BASE_URL;

    const logoSrc = `${BASE_URL}assets/img/LogoTienda-SinFondo.png`;

    return (
        <footer className="footer-principal" id="contacto">
            <div className="footer-container">
                
                <div className="footer-col">
                    
                    <div className="brand-footer">
                        <img 
                            src={logoSrc} 
                            alt="Logo" 
                            className="logo-medio" 
                        />
                        <h3>Level-Up</h3>
                    </div>

                    <p>
                        Tu tienda gamer de confianza con los mejores precios y la mejor atención al cliente. 
                        Ofrecemos productos de calidad y servicio técnico especializado.
                    </p>

                    <div className="redes-sociales">
                        <a href="#"><i className="fa-brands fa-facebook"></i> Facebook</a>
                        <a href="#"><i className="fa-brands fa-instagram"></i> Instagram</a>
                        <a href="#"><i className="fa-brands fa-twitter"></i> Twitter</a>
                    </div>
                </div>

                <div className="footer-col">
                    <h3>Explorar</h3>
                    <ul>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/productos">Catálogo Completo</Link></li>
                        <li><Link to="/blog">Blog de Tecnología</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h3>Soporte</h3>
                    <ul>
                        <li><a href="/sobre-nosotros">Centro de Ayuda</a></li>
                        <li><a href="/envios">Rastrea tu pedido</a></li>
                        <li><Link to="/servicio-tecnico">Servicio Técnico</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h3>Contacto</h3>
                    <p><i className="fa-solid fa-location-dot fa-fw"></i> Antonio Varas 666, Santiago</p>
                    <p><i className="fa-solid fa-phone fa-fw"></i> +56 9 7526 0485</p>
                    <p><i className="fa-solid fa-envelope fa-fw"></i> contacto@levelup.com</p>
                </div>

            </div>

            <div className="footer-bottom">
                <p>&copy; 2024 Level-Up Store. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;