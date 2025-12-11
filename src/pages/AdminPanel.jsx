import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    getProductos, 
    crearProductoAPI, 
    actualizarProductoAPI, 
    eliminarProductoAPI, 
    getUsuariosAPI, 
    getDashboardData,
    getVentasAPI 
} from '../services/dataService';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState('dashboard');
    const [notification, setNotification] = useState(null);
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [productos, setProductos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [ventas, setVentas] = useState([]);
    const [stats, setStats] = useState({ totalProductos: 0, totalVentas: 0, totalUsuarios: 0 });

    const [formProducto, setFormProducto] = useState({
        id: null, nombre: '', precio: '', categoria: '', stock: '', descripcion: '', imgFile: null
    });
    const [specsList, setSpecsList] = useState([{ key: '', value: '' }]);

    // 💡 Versión robusta de la función de URL, usando BASE_URL para el fallback
    const getImgUrl = (path) => {
        const base = import.meta.env.BASE_URL; 
        const fallback = `${base}assets/img/ps5-caja.png`; // Fallback usa BASE_URL
        
        if (!path) return fallback;
        if (path.startsWith("http")) return path;
        
        // Si la ruta es un asset local (para el logo o el fallback)
        if (path.startsWith("/assets")) {
             return `${base.replace(/\/$/, '')}${path}`;
        }
        
        // Ruta del Backend (causa más probable de error 404)
        return `http://localhost:8080/api/productos/images/${path}`;
    };

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') navigate('/');
        else loadData();
    }, [user, navigate]);

    const loadData = async () => {
        try {
            const [prods, users, sales, dashboard] = await Promise.all([
                getProductos(),
                getUsuariosAPI(),
                getVentasAPI(),
                getDashboardData()
            ]);
            setProductos(prods);
            setUsuarios(users);
            setVentas(sales.sort((a, b) => b.id - a.id));
            setStats(dashboard);
        } catch (error) {
            console.error(error);
        }
    };

    const showMsg = (text, type = 'success') => {
        setNotification({ text, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSpecChange = (index, field, value) => {
        const newSpecs = [...specsList];
        newSpecs[index][field] = value;
        setSpecsList(newSpecs);
    };
    const addSpecField = () => setSpecsList([...specsList, { key: '', value: '' }]);
    const removeSpecField = (index) => setSpecsList(specsList.filter((_, i) => i !== index));

    const handleEditarClick = (prod) => {
        let specsArray = [{ key: '', value: '' }];
        if (prod.specs) {
            try {
                const parsed = JSON.parse(prod.specs);
                specsArray = Object.keys(parsed).map(key => ({ key, value: parsed[key] }));
            } catch (e) {}
        }

        setFormProducto({
            id: prod.id,
            nombre: prod.nombre,
            precio: prod.precio,
            categoria: prod.categoria,
            stock: prod.stock || 0,
            descripcion: prod.descripcion || '',
            imgFile: null
        });
        setSpecsList(specsArray);
        setIsEditing(true);
        setActiveTab('productos');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelarEdicion = () => {
        setFormProducto({ id: null, nombre: '', precio: '', categoria: '', stock: '', descripcion: '', imgFile: null });
        setSpecsList([{ key: '', value: '' }]);
        setIsEditing(false);
    };

    const handleSubmitProducto = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            fd.append('nombre', formProducto.nombre);
            fd.append('precio', formProducto.precio);
            fd.append('categoria', formProducto.categoria);
            fd.append('stock', formProducto.stock);
            fd.append('descripcion', formProducto.descripcion);
            if (formProducto.imgFile) fd.append('imagen', formProducto.imgFile);

            const specsObject = {};
            specsList.forEach(item => {
                if (item.key.trim() && item.value.trim()) specsObject[item.key] = item.value;
            });
            fd.append('specs', JSON.stringify(specsObject));

            if (isEditing) {
                await actualizarProductoAPI(formProducto.id, fd);
                showMsg("Producto actualizado correctamente");
            } else {
                await crearProductoAPI(fd);
                showMsg("Producto creado correctamente");
            }
            
            handleCancelarEdicion();
            loadData();
        } catch (error) {
            showMsg("Error: " + error.message, "error");
        }
    };

    const handleEliminar = async (id) => {
        if(window.confirm("¿Seguro que deseas eliminar este producto?")) {
            try {
                await eliminarProductoAPI(id);
                loadData();
                showMsg("Producto eliminado", "success");
            } catch(e) {
                showMsg("Error al eliminar", "error");
            }
        }
    };

    if (!user || user.role !== 'ADMIN') return null;

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    {/* El logo usa la función getImgUrl, que maneja la BASE_URL de Vite */}
                    <img src={getImgUrl("/assets/img/LogoTienda-SinFondo.png")} alt="Admin" className="sidebar-logo" />
                </div>
                <nav className="sidebar-nav">
                    <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}>Resumen</button>
                    <button onClick={() => setActiveTab('ventas')} className={activeTab === 'ventas' ? 'active' : ''}>Ventas</button>
                    <button onClick={() => setActiveTab('productos')} className={activeTab === 'productos' ? 'active' : ''}>Productos</button>
                    <button onClick={() => setActiveTab('usuarios')} className={activeTab === 'usuarios' ? 'active' : ''}>Usuarios</button>
                </nav>
                <div className="sidebar-footer"><Link to="/" onClick={logout}>Salir</Link></div>
            </aside>

            <main className="admin-content">
                
                {notification && (
                    <div className={`notification-box ${notification.type === 'success' ? 'notify-success' : 'notify-error'}`}>
                        {notification.text}
                    </div>
                )}

                {activeTab === 'dashboard' && (
                    <section className="admin-section">
                        <h2>Resumen General</h2>
                        <div className="kpi-grid">
                            <div className="kpi-card"><h3>Ventas Totales</h3><p className="numero">{stats.totalVentas}</p></div>
                            <div className="kpi-card"><h3>Productos</h3><p className="numero">{stats.totalProductos}</p></div>
                            <div className="kpi-card"><h3>Clientes</h3><p className="numero">{stats.totalUsuarios}</p></div>
                        </div>
                    </section>
                )}

                {activeTab === 'ventas' && (
                    <section className="admin-section">
                        <h3>Historial de Ventas</h3>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Cliente</th>
                                    <th>Total</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ventas.map(v => (
                                    <tr key={v.id}>
                                        <td>#{v.id}</td>
                                        <td>{new Date(v.fecha).toLocaleString()}</td>
                                        <td>{v.usuario?.nombre}</td>
                                        <td style={{fontWeight:'bold'}}>${v.total.toLocaleString()}</td>
                                        <td>
                                            <button className="btn-admin" style={{padding:'5px 10px', fontSize:'0.8rem'}} onClick={() => setVentaSeleccionada(v)}>
                                                Ver Detalle
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}

                {activeTab === 'productos' && (
                    <section className="admin-section">
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
                            <h3>Inventario</h3>
                            {isEditing && <button onClick={handleCancelarEdicion} className="btn-delete">Cancelar Edición</button>}
                        </div>
                        
                        <div className="add-product-form" style={{border: isEditing ? '2px solid orange' : '1px solid #eee'}}>
                            <h4 style={{color: isEditing ? '#e67e22' : '#38a1ee'}}>
                                {isEditing ? '✏️ Editando Producto' : '➕ Nuevo Producto'}
                            </h4>
                            
                            <form onSubmit={handleSubmitProducto}>
                                <div className="form-row">
                                    <input type="text" placeholder="Nombre" value={formProducto.nombre} onChange={e => setFormProducto({...formProducto, nombre: e.target.value})} required />
                                    <input type="number" placeholder="Precio" value={formProducto.precio} onChange={e => setFormProducto({...formProducto, precio: e.target.value})} required />
                                </div>
                                <div className="form-row">
                                    <select value={formProducto.categoria} onChange={e => setFormProducto({...formProducto, categoria: e.target.value})} required>
                                        <option value="">Categoría...</option>
                                        <option value="Notebooks">Notebooks</option>
                                        <option value="Consolas">Consolas</option>
                                        <option value="Periféricos">Periféricos</option>
                                        <option value="Mobiliario">Mobiliario</option>
                                        <option value="Accesorios">Accesorios</option>
                                    </select>
                                    <input type="number" placeholder="Stock" value={formProducto.stock} onChange={e => setFormProducto({...formProducto, stock: e.target.value})} required />
                                </div>
                                <div className="form-row">
                                    <textarea placeholder="Descripción" rows="2" value={formProducto.descripcion} onChange={e => setFormProducto({...formProducto, descripcion: e.target.value})} style={{width:'100%', padding:'10px', border:'1px solid #ddd', borderRadius:'5px'}}></textarea>
                                </div>

                                <div style={{background:'#f9f9f9', padding:'10px', marginBottom:'10px', borderRadius:'5px'}}>
                                    <label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Especificaciones Técnicas</label>
                                    {specsList.map((s, i) => (
                                        <div key={i} style={{display: 'flex', gap: '10px', marginBottom: '5px'}}>
                                            <input placeholder="Clave (Ej: RAM)" value={s.key} onChange={e => handleSpecChange(i, 'key', e.target.value)} />
                                            <input placeholder="Valor (Ej: 16GB)" value={s.value} onChange={e => handleSpecChange(i, 'value', e.target.value)} />
                                            <button type="button" onClick={() => removeSpecField(i)} style={{background:'#ff4757', color:'white', border:'none', borderRadius:'4px', cursor:'pointer'}}>X</button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addSpecField} style={{background:'#38a1ee', color:'white', border:'none', padding:'5px', borderRadius:'4px', cursor:'pointer', fontSize:'0.8rem'}}>+ Agregar Spec</button>
                                </div>

                                <div className="form-row">
                                    <input type="file" accept="image/*" onChange={e => setFormProducto({...formProducto, imgFile: e.target.files[0]})} />
                                </div>
                                <button type="submit" className="btn-admin" style={{width:'100%', background: isEditing ? '#e67e22' : '#38a1ee'}}>
                                    {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
                                </button>
                            </form>
                        </div>

                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Img</th>
                                    <th>Producto</th>
                                    <th>Stock</th>
                                    <th>Precio</th>
                                    <th>Última Mod.</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map(p => (
                                    <tr key={p.id}>
                                        <td>
                                            <img 
                                                src={getImgUrl(p.img)} 
                                                style={{width:40, height:40, objectFit:'cover', borderRadius:'4px'}} 
                                                // El onError también usa la función getImgUrl con null para obtener la ruta de fallback con BASE_URL
                                                onError={e => e.target.src = getImgUrl(null)} 
                                                alt={p.nombre}
                                            />
                                        </td>
                                        <td>{p.nombre}</td>
                                        <td>
                                            <span className="tag-status" style={{background: p.stock<5?'#ffebee':'#e8f5e9', color:p.stock<5?'#c62828':'#2e7d32'}}>
                                                {p.stock} u.
                                            </span>
                                        </td>
                                        <td>${p.precio.toLocaleString()}</td>
                                        <td style={{fontSize:'0.8rem', color:'#666'}}>
                                            <div>{p.lastModifiedBy || 'Sistema'}</div>
                                            <div style={{fontSize:'0.7rem'}}>{p.lastModifiedDate ? new Date(p.lastModifiedDate).toLocaleDateString() : '-'}</div>
                                        </td>
                                        <td>
                                            <button onClick={() => handleEditarClick(p)} className="btn-edit" style={{marginRight:5}}><i className="fa-solid fa-pen"></i></button>
                                            <button onClick={() => handleEliminar(p.id)} className="btn-delete"><i className="fa-solid fa-trash"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}

                {activeTab === 'usuarios' && (
                    <section className="admin-section">
                        <h3>Usuarios Registrados</h3>
                        <table className="admin-table">
                            <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th></tr></thead>
                            <tbody>
                                {usuarios.map(u => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td>{u.nombre} {u.apellido}</td>
                                        <td>{u.email}</td>
                                        <td><span className="tag-status" style={{background: u.role==='ADMIN'?'#fff3cd':'#cce5ff', color: u.role==='ADMIN'?'#856404':'#004085'}}>{u.role}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}

            </main>

            {ventaSeleccionada && (
                <div className="modal-overlay" onClick={() => setVentaSeleccionada(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="btn-close-modal" onClick={() => setVentaSeleccionada(null)}>&times;</button>
                        <h2 style={{marginBottom:'20px', color:'#333'}}>Detalle Boleta #{ventaSeleccionada.id}</h2>
                        
                        <div style={{background:'#f9f9f9', padding:'15px', borderRadius:'8px', marginBottom:'20px'}}>
                            <p><strong>Fecha:</strong> {new Date(ventaSeleccionada.fecha).toLocaleString()}</p>
                            <p><strong>Cliente:</strong> {ventaSeleccionada.usuario?.nombre}</p>
                            <p><strong>Email:</strong> {ventaSeleccionada.usuario?.email}</p>
                        </div>

                        <h4>Productos:</h4>
                        <div style={{maxHeight:'300px', overflowY:'auto'}}>
                            {ventaSeleccionada.detalles?.map(d => (
                                <div key={d.id} className="detalle-item">
                                    {/* Aquí también usamos la función getImgUrl con la misma lógica */}
                                    <img src={getImgUrl(d.producto.img)} alt={d.producto.nombre} onError={e => e.target.src=getImgUrl(null)} />
                                    <div style={{flex:1}}>
                                        <h5 style={{margin:0}}>{d.producto.nombre}</h5>
                                        <small style={{color:'#666'}}>SKU: {d.producto.id}</small>
                                    </div>
                                    <div style={{textAlign:'right'}}>
                                        <div>{d.cantidad} x ${d.precioUnitario.toLocaleString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{marginTop:'20px', textAlign:'right', fontSize:'1.5rem', fontWeight:'bold', color:'#38a1ee'}}>
                            Total: ${ventaSeleccionada.total.toLocaleString()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;