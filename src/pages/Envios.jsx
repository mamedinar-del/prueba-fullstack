import { Link } from 'react-router-dom';

const Envios = () => {

    const handleRastreo = (e) => {
        e.preventDefault();
        alert('Funcionalidad simulada: Tu pedido está en camino 🚚');
    };

    return (
        <main>
            <section className="page-header-envios">
                <h1>Envíos y Entregas</h1>
                <p>Todo lo que necesitas saber sobre cómo llega tu compra a casa.</p>
            </section>

            <section className="proceso-envio">
                <h2 className="titulo-centro">¿Cómo funciona?</h2>
                
                <div className="steps-container">
                    <div className="step-item">
                        <div className="step-icon">
                            <i className="fa-solid fa-mouse-pointer"></i>
                        </div>
                        <h3>1. Compra</h3>
                        <p>Eliges tus productos y confirmas el pago.</p>
                    </div>
                    
                    <div className="step-arrow"><i className="fa-solid fa-angle-right"></i></div>

                    <div className="step-item">
                        <div className="step-icon">
                            <i className="fa-solid fa-box-open"></i>
                        </div>
                        <h3>2. Preparación</h3>
                        <p>Armamos tu paquete con protección extra.</p>
                    </div>

                    <div className="step-arrow"><i className="fa-solid fa-angle-right"></i></div>

                    <div className="step-item">
                        <div className="step-icon">
                            <i className="fa-solid fa-truck-fast"></i>
                        </div>
                        <h3>3. Envío</h3>
                        <p>Lo entregamos al courier (BlueExpress/Starken).</p>
                    </div>

                    <div className="step-arrow"><i className="fa-solid fa-angle-right"></i></div>

                    <div className="step-item">
                        <div className="step-icon">
                            <i className="fa-solid fa-house-chimney-user"></i>
                        </div>
                        <h3>4. Recibes</h3>
                        <p>¡A disfrutar tu nueva tecnología!</p>
                    </div>
                </div>
            </section>

            <section className="reglas-envio">
                <div className="reglas-grid">
                    
                    <div className="regla-card">
                        <div className="icon-header"><i className="fa-regular fa-clock"></i></div>
                        <h3>Plazos de Entrega</h3>
                        <ul>
                            <li><strong>Región Metropolitana:</strong> 24 a 48 horas hábiles.</li>
                            <li><strong>Otras Regiones:</strong> 2 a 5 días hábiles.</li>
                            <li><strong>Zonas Extremas:</strong> Hasta 10 días hábiles.</li>
                        </ul>
                    </div>

                    <div className="regla-card">
                        <div className="icon-header"><i className="fa-solid fa-coins"></i></div>
                        <h3>Costos de Despacho</h3>
                        <ul>
                            <li><strong>RM:</strong> $3.990 fijo.</li>
                            <li><strong>Regiones:</strong> Se calcula al pagar según peso.</li>
                            <li><strong>Envío GRATIS:</strong> En compras sobre $100.000.</li>
                        </ul>
                    </div>

                    <div className="regla-card">
                        <div className="icon-header"><i className="fa-solid fa-map-location-dot"></i></div>
                        <h3>Cobertura</h3>
                        <p>Enviamos a <strong>todo Chile continental</strong> a través de nuestros partners logísticos.</p>
                        <p className="nota-chica">* No realizamos envíos a casillas postales.</p>
                    </div>

                </div>
            </section>

            <section className="rastreo-section">
                <div className="rastreo-box">
                    <h2><i className="fa-solid fa-satellite-dish"></i> Rastrea tu Pedido</h2>
                    <p>Ingresa tu número de orden (ej: #ORD-1234) para ver dónde está.</p>
                    
                    <form className="form-rastreo" onSubmit={handleRastreo}>
                        <input type="text" placeholder="Número de Orden" required />
                        <button type="submit">Buscar</button>
                    </form>
                </div>
            </section>

        </main>
    );
};

export default Envios;