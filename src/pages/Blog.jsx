import { Link } from 'react-router-dom';
import { getImagenUrl } from '../services/dataService';

const Blog = () => {

    const recentPosts = [
        {
            id: 1,
            img: "/assets/img/pic1.jpg", 
            category: "PC Gaming",
            catClass: "pc",
            date: "Hace 2 horas",
            title: "Las mejores gráficas calidad-precio del año",
            desc: "Si estás armando tu PC, esta guía definitiva te ayudará a elegir sin gastar de más."
        },
        {
            id: 2,
            img: "/assets/img/pic2.jpg", 
            category: "Review",
            catClass: "review",
            date: "Ayer",
            title: 'Análisis: "Final-Fantasy VII"',
            desc: "¿Vale la pena las 100 horas de juego? Probamos el RPG más esperado del año."
        },
        {
            id: 3,
            img: "/assets/img/pic3.jpg", 
            category: "Mobile",
            catClass: "mobile",
            date: "24 Nov 2025",
            title: "Los juegos móviles ya superan a las consolas",
            desc: "Estadísticas revelan que el mercado móvil domina el 60% de las ganancias globales."
        },
        {
            id: 4,
            img: "/assets/img/pic4.jpg", 
            category: "Streaming",
            catClass: "streaming",
            date: "20 Nov 2025",
            title: "Kit Básico para empezar en Twitch",
            desc: "Micrófonos, cámaras y luces: Todo lo que necesitas por menos de $200."
        },
        {
            id: 5,
            img: "/assets/img/pic5.jpg", 
            category: "Retro",
            catClass: "retro",
            date: "18 Nov 2025",
            title: "¿Por qué los juegos viejos son tan caros?",
            desc: "El mercado del coleccionismo retro está explotando. Te explicamos las causas."
        },
        {
            id: 6,
            img: "/assets/img/pic6.jpg", 
            category: "E-Sports",
            catClass: "esports",
            date: "15 Nov 2025",
            title: "Final del Mundial de LoL: Resumen",
            desc: "Las mejores jugadas y el equipo ganador de la copa este año."
        }
    ];

    return (
        <main>
            <section className="page-header-blog">
                <h1>Level-Up News</h1>
                <p>Lo último en consolas, lanzamientos y tecnología.</p>
            </section>

            <section className="blog-container">
                
                <article className="blog-featured">
                    <div className="featured-img">
                        <img 
                            src={getImagenUrl("/assets/img/pic-main.jpg")} 
                            alt="Consola Nueva Generación" 
                        /> 
                        <span className="badge-cat">Consolas</span>
                    </div>
                    <div className="featured-content">
                        <div className="meta-data">
                            <span><i className="fa-regular fa-calendar"></i> 26 Nov 2025</span>
                            <span><i className="fa-regular fa-user"></i> Admin</span>
                        </div>
                        <h2>La próxima generación de consolas: ¿Qué esperar para 2026?</h2>
                        <p>Los rumores sobre la sucesora de "Xbox Series X" y la "PS6" son cada vez más fuertes. Analizamos las patentes filtradas y lo que significan para el futuro del gaming portátil y de sobremesa.</p>
                        <Link to="#" className="btn-leer-mas">
                            Leer Artículo Completo <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                    </div>
                </article>

                <h3 className="section-title">Noticias Recientes</h3>
                
                <div className="blog-grid">
                    {recentPosts.map((post) => (
                        <article className="blog-card" key={post.id}>
                            <div className="card-img">
                                <img src={getImagenUrl(post.img)} alt={post.title} />
                                <span className={`badge-cat ${post.catClass}`}>{post.category}</span>
                            </div>
                            <div className="card-content">
                                <span className="date">{post.date}</span>
                                <h3>{post.title}</h3>
                                <p>{post.desc}</p>
                                <Link to="#" className="link-simple">Leer más</Link>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

        </main>
    );
};

export default Blog;