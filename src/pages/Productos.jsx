import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProductos, getImagenUrl } from '../services/dataService';
import { useCart } from '../context/CartContext';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const { addToCart } = useCart();
    
    const [busqueda, setBusqueda] = useState("");
    const [categoria, setCategoria] = useState("Todas");
    const [precioMax, setPrecioMax] = useState(2000000);
    const [orden, setOrden] = useState("defecto");

    useEffect(() => {
        const cargarDatos = async () => {
            const data = await getProductos();
            setProductos(data);
        };
        cargarDatos();

        const query = searchParams.get("q");
        if (query) setBusqueda(query);
    }, [searchParams]);

    const handleSearchChange = (e) => {
        setBusqueda(e.target.value);
        if(e.target.value === "") setSearchParams({});
    };


    const productosProcesados = productos
        .filter((prod) => {
            return (
                prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
                (categoria === "Todas" || prod.categoria === categoria) &&
                prod.precio <= precioMax
            );
        })
        .sort((a, b) => {
            if (orden === "menor") return a.precio - b.precio;
            if (orden === "mayor") return b.precio - a.precio;
            return 0;
        });

    const categorias = ["Todas", "Notebooks", "Periféricos", "Consolas", "Mobiliario", "Accesorios", "Componentes"];

    return (
        <main className="catalogo-page">
            <div className="catalogo-wrapper">
                
                <aside className="sidebar-filtros">
                    <div className="sidebar-header">
                        <h3><i className="fa-solid fa-filter"></i> Filtros</h3>
                        <button 
                            className="btn-reset"
                            onClick={() => {
                                setBusqueda("");
                                setCategoria("Todas");
                                setPrecioMax(2000000);
                                setOrden("defecto");
                                setSearchParams({});
                            }}
                        >
                            Limpiar
                        </button>
                    </div>

                    <div className="filtro-item">
                        <label>Buscar</label>
                        <div className="input-group-icon">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input type="text" placeholder="Ej: Teclado..." value={busqueda} onChange={handleSearchChange} />
                        </div>
                    </div>

                    <div className="filtro-item">
                        <label>Categoría</label>
                        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                            {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    <div className="filtro-item">
                        <label>Precio Máx: ${precioMax.toLocaleString()}</label>
                        <input type="range" min="0" max="2000000" step="10000" value={precioMax} onChange={(e) => setPrecioMax(Number(e.target.value))} className="range-slider" />
                    </div>

                    <div className="filtro-item">
                        <label>Ordenar por</label>
                        <select value={orden} onChange={(e) => setOrden(e.target.value)}>
                            <option value="defecto">Relevancia</option>
                            <option value="menor">Precio: Menor a Mayor</option>
                            <option value="mayor">Precio: Mayor a Menor</option>
                        </select>
                    </div>
                </aside>

                <section className="galeria-productos">
                    <div className="galeria-header">
                        <h2>Catálogo</h2>
                        <span className="contador-resultados">{productosProcesados.length} resultados</span>
                    </div>

                    {productosProcesados.length > 0 ? (
                        <div className="grid-responsive">
                            {productosProcesados.map((prod) => {
                                const sinStock = prod.stock <= 0;

                                return (
                                    <article className={`card-producto-pro ${sinStock ? 'agotado' : ''}`} key={prod.id}>
                                        <div className="card-img-box">
                                            <Link to={`/producto/${prod.id}`}>
                                                <img 
                                                    src={getImagenUrl(prod.img)} 
                                                    alt={prod.nombre} 
                                                    onError={(e) => e.target.src = getImagenUrl(null)} 
                                                />
                                            </Link>
                                            
                                            {!sinStock && prod.badge && (
                                                <span className="badge-flotante" style={{background: prod.badgeColor || '#38a1ee'}}>
                                                    {prod.badge}
                                                </span>
                                            )}

                                            {sinStock && (
                                                <div className="overlay-agotado">
                                                    <span>AGOTADO</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="card-info">
                                            <p className="card-cat">{prod.categoria}</p>
                                            <h3>
                                                <Link to={`/producto/${prod.id}`}>{prod.nombre}</Link>
                                            </h3>
                                            
                                            {prod.stock > 0 && prod.stock < 5 && (
                                                <small style={{color: '#e67e22', fontWeight: 'bold', marginBottom: '5px', display:'block'}}>
                                                    ¡Últimas {prod.stock} unidades!
                                                </small>
                                            )}

                                            <div className="card-footer">
                                                <span className="card-precio">${prod.precio.toLocaleString()}</span>
                                                
                                                {sinStock ? (
                                                    <button className="btn-add-mini disabled" disabled title="Sin Stock">
                                                        <i className="fa-solid fa-ban"></i>
                                                    </button>
                                                ) : (
                                                    <button 
                                                        className="btn-add-mini"
                                                        onClick={() => addToCart(prod)}
                                                        title="Agregar al carrito"
                                                    >
                                                        <i className="fa-solid fa-cart-plus"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="estado-vacio">
                            <i className="fa-solid fa-ghost"></i>
                            <h3>No encontramos nada</h3>
                            <p>Intenta ajustar los filtros de búsqueda.</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Productos;