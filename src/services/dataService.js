const API_URL = "http://18.218.0.241:8080/api";
const SERVER_URL = "http://18.218.0.241:8080";

export const getImagenUrl = (imgPath) => {
    const rutaAProcesar = imgPath || "/assets/img/ps5-caja.png";

    let urlFinal;
    
    if (rutaAProcesar.startsWith("http")) {
        urlFinal = rutaAProcesar;
    } 
    else if (rutaAProcesar.startsWith("/api")) {
        urlFinal = `${SERVER_URL}${rutaAProcesar}`;
    } 
    else if (rutaAProcesar.startsWith("/")) {
        const base = import.meta.env.BASE_URL;
        const prefix = base.endsWith('/') ? base : `${base}/`;
        urlFinal = `${prefix}${rutaAProcesar.substring(1)}`;
    } 
    else {
        urlFinal = rutaAProcesar;
    }

    console.log(`Imagen Input: ${imgPath} | URL Generada: ${urlFinal}`);
    
    return urlFinal;
};

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('levelup_user'));
    if (user && user.token) {
        return { 'Authorization': `Bearer ${user.token}` };
    }
    return {};
};

export const getProductos = async () => {
    try {
        const response = await fetch(`${API_URL}/productos`);
        if (!response.ok) throw new Error("Error al cargar productos");
        return await response.json();
    } catch (error) {
        console.error("Error API:", error);
        return [];
    }
};

export const crearProductoAPI = async (productoData) => {
    const response = await fetch(`${API_URL}/productos`, {
        method: 'POST',
        headers: {
            ...getAuthHeader() 
        },
        body: productoData
    });
    if (!response.ok) throw new Error("Error al crear producto");
    return await response.json();
};

export const actualizarProductoAPI = async (id, productoData) => {
    const response = await fetch(`${API_URL}/productos/${id}`, {
        method: 'PUT',
        headers: {
            ...getAuthHeader()
        },
        body: productoData
    });
    if (!response.ok) throw new Error("Error al actualizar producto");
    return await response.json();
};

export const eliminarProductoAPI = async (id) => {
    const response = await fetch(`${API_URL}/productos/${id}`, {
        method: 'DELETE',
        headers: {
            ...getAuthHeader()
        }
    });
    if (!response.ok) throw new Error("Error al eliminar producto");
    return true;
};

export const loginAPI = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
        throw new Error("Credenciales incorrectas");
    }
    return await response.json();
};

export const registerAPI = async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error en el registro");
    }
    return await response.json();
};

export const actualizarUsuarioAPI = async (id, datos) => {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify(datos)
    });
    if (!response.ok) throw new Error("Error al actualizar perfil");
    return await response.json();
};

export const getUsuariosAPI = async () => {
    try {
        const response = await fetch(`${API_URL}/usuarios`, {
            headers: { ...getAuthHeader() }
        });
        if (!response.ok) throw new Error("Error al cargar usuarios");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const agendarCitaAPI = async (citaData) => {
    const response = await fetch(`${API_URL}/citas`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombreCliente: citaData.nombre,
            telefono: citaData.telefono,
            email: citaData.email,
            dispositivo: citaData.dispositivo,
            fechaPreferida: citaData.fecha,
            mensaje: citaData.mensaje
        })
    });
    
    if (!response.ok) throw new Error("Error al agendar cita");
    return await response.json();
};

export const crearPedidoAPI = async (usuarioId, carrito, cupon = "") => {
    const response = await fetch(`${API_URL}/boletas`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify({
            usuarioId: usuarioId,
            cupon: cupon,
            items: carrito.map(item => ({
                id: item.id,
                quantity: item.quantity
            }))
        })
    });

    if (!response.ok) throw new Error("Error al procesar compra");
    return await response.json();
};

export const getMisPedidosAPI = async (usuarioId) => {
    const response = await fetch(`${API_URL}/boletas/usuario/${usuarioId}`, {
        headers: { ...getAuthHeader() }
    });
    if (!response.ok) throw new Error("Error al cargar historial");
    return await response.json();
};


export const getDashboardData = async () => {
    try {
        const [prodsRes, usersRes, ordersRes] = await Promise.all([
            fetch(`${API_URL}/productos`),
            fetch(`${API_URL}/usuarios`, { headers: getAuthHeader() }),
            fetch(`${API_URL}/boletas`, { headers: getAuthHeader() })
        ]);

        const prods = await prodsRes.json();
        const users = await usersRes.json();
        const orders = await ordersRes.json();
        
        return {
            totalProductos: Array.isArray(prods) ? prods.length : 0,
            totalUsuarios: Array.isArray(users) ? users.length : 0,
            totalVentas: Array.isArray(orders) ? orders.length : 0
        };
    } catch (error) {
        console.error("Error cargando dashboard:", error);
        return { totalProductos: 0, totalUsuarios: 0, totalVentas: 0 };
    }
};

export const getVentasAPI = async () => {
    try {
        const response = await fetch(`${API_URL}/boletas`, {
            headers: { ...getAuthHeader() }
        });
        if (!response.ok) throw new Error("Error al cargar ventas");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};