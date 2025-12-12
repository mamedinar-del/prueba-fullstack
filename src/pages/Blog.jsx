import { Link } from 'react-router-dom';
import picMain from '../assets/img/pic-main.jpg'; 
import pic1 from '../assets/img/pic1.jpg';
import pic2 from '../assets/img/pic2.jpg';
import pic3 from '../assets/img/pic3.jpg';
import pic4 from '../assets/img/pic4.jpg';
import pic5 from '../assets/img/pic5.jpg';
import pic6 from '../assets/img/pic6.jpg';

const Blog = () => {

    const recentPosts = [
        {
            id: 1,
            img: pic1, 
            category: "PC Gaming",
            catClass: "pc",
            date: "Hace 2 horas",
            title: "Las mejores gráficas calidad-precio del año",
            desc: "Si estás armando tu PC, esta guía definitiva te ayudará a elegir sin gastar de más."
        },
        {
            id: 2,
            img: pic2, 
            category: "Review",
            catClass: "review",
            date: "Ayer",
            title: 'Análisis: "Final-Fantasy VII"',
            desc: "¿Vale la pena las 100 horas de juego? Probamos el RPG más esperado del año."
        },
        {
            id: 3,
            img: pic3, 
            category: "Mobile",
            catClass: "mobile",
            date: "24 Nov 2025",
            title: "Los juegos móviles ya superan a las consolas",
            desc: "Estadísticas revelan que el mercado móvil domina el 60% de las ganancias globales."
        },
        {
            id: 4,
            img: pic4, 
            category: "Streaming",
            catClass: "streaming",
            date: "20 Nov 2025",
            title: "Kit Básico para empezar en Twitch",
            desc: "Micrófonos, cámaras y luces: Todo lo que necesitas por menos de $200."
        },
        {
            id: 5,
            img: pic5, 
            category: "Retro",
            catClass: "retro",
            date: "18 Nov 2025",
            title: "¿Por qué los juegos viejos son tan caros?",
            desc: "El mercado del coleccionismo retro está explotando. Te explicamos las causas."
        },
        {
            id: 6,
            img: pic6, 
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
                        <img src={picMain} alt="Consola Nueva Generación" /> 
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
                                <img src={post.img} alt={post.title} />
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