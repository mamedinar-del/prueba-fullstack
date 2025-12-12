import React from 'react';

import aboutUsImage from '../assets/img/about-us.png';

const SobreNosotros = () => {
    return (
        <main>
            <section className="page-header">
                <h1>Nuestra Historia</h1>
                <p>Conoce al equipo detrás de Level-Up Store</p>
            </section>

            <section className="about-section">
                <div className="about-container">
                    <div className="about-text">
                        <h2>Pasión por la Tecnología</h2>
                        <p>Fundada en 2024, Level-Up nació con una misión clara: democratizar el acceso a la mejor tecnología gaming en Chile.</p>
                        <p>Lo que comenzó como un pequeño taller, hoy es líder del sector. Creemos que la tecnología es una herramienta para crear, jugar y conectar.</p>
                    </div>
                    <div className="about-image">
                        <img src={aboutUsImage} alt="Equipo" />
                    </div>
                </div>
            </section>

            <section className="testimonios-section">
                <h2 className="titulo-centro">Lo que dicen nuestros clientes</h2>
                <div className="testimonios-grid">
                    <div className="testimonio-card"><div className="stars">⭐⭐⭐⭐⭐</div><p>"Excelente atención y precios competitivos."</p><h4>- Felipe Muñoz</h4></div>
                    <div className="testimonio-card"><div className="stars">⭐⭐⭐⭐⭐</div><p>"Envío rápido a región, llegó todo perfecto."</p><h4>- Andrea Rojas</h4></div>
                    <div className="testimonio-card"><div className="stars">⭐⭐⭐⭐⭐</div><p>"El servicio técnico revivió mi notebook."</p><h4>- Javier Soto</h4></div>
                </div>
            </section>

            <section className="faq-section">
                <h2 className="titulo-centro">Preguntas Frecuentes</h2>
                <div className="faq-grid-horizontal">
                    <div className="faq-item-horizontal"><i className="fa-solid fa-shop faq-icon"></i><h3>Tienda Física</h3><p>Antonio Varas 666, Santiago.</p></div>
                    <div className="faq-item-horizontal"><i className="fa-solid fa-truck-fast faq-icon"></i><h3>Envíos</h3><p>A todo Chile vía BlueExpress.</p></div>
                    <div className="faq-item-horizontal"><i className="fa-solid fa-shield-halved faq-icon"></i><h3>Garantía</h3><p>6 meses legal en todo.</p></div>
                    <div className="faq-item-horizontal"><i className="fa-solid fa-file-invoice-dollar faq-icon"></i><h3>Factura</h3><p>Disponible al comprar.</p></div>
                </div>
            </section>

            <section className="pagos-section">
                <h2 className="titulo-centro">Medios de Pago</h2>
                <div className="pagos-grid">
                    <div className="pago-item"><i className="fa-solid fa-credit-card"></i><span>Webpay Plus</span></div>
                    <div className="pago-item"><i className="fa-regular fa-credit-card"></i><span>Redcompra</span></div>
                    <div className="pago-item"><i className="fa-solid fa-money-bill-transfer"></i><span>Transferencia</span></div>
                    <div className="pago-item"><i className="fa-solid fa-handshake"></i><span>Mercado Pago</span></div>
                    <div className="pago-item"><i className="fa-solid fa-mobile-screen-button"></i><span>Mach</span></div>
                </div>
            </section>
        </main>
    );
};
export default SobreNosotros;