import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar-secundaria">
        <ul className="menu-categorias">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/sobre-nosotros">Sobre Nosotros</Link></li>
            <li><Link to="/servicio-tecnico">Servicio Técnico</Link></li>
            <li><Link to="/envios">Envíos</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><a href="#contacto">Contacto</a></li>
        </ul>
    </nav>
  );
};

export default Navbar;