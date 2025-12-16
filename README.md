Level-Up Store - Frontend
Este es el frontend para la plataforma de comercio electrónico Level-Up. Es una aplicación de página única (SPA) rápida y moderna construida con React y Vite, diseñada para interactuar con un backend Spring Boot.

Características Principales
Catálogo de Productos: Visualización de productos con filtrado por categorías.

Detalle de Producto: Vista detallada con galería de imágenes y descripciones enriquecidas (HTML).

Carrito de Compras: Gestión de estado global para añadir, eliminar y calcular totales.

Panel de Administración:

Gestión de productos (CRUD).

Editor de texto enriquecido para descripciones (react-quill-new).

Gestión de stock e imágenes.

Autenticación: Login y Registro de usuarios (Integración JWT).

Diseño Responsivo: Adaptado a móviles y escritorio.

Tecnologías Utilizadas
Core: React (v18+), Vite.

Enrutamiento: React Router DOM.

Estado & HTTP: Context API (Nativo), Axios.

Estilos: CSS3, FontAwesome (Iconos).

Utilidades: react-quill-new (Editor de texto), dompurify (Sanitización HTML).

Testing: Vitest, Testing Library, Coverage V8.

Prerrequisitos
Node.js: v16.0.0 o superior.

NPM: v8.0.0 o superior.

Backend: El servidor Spring Boot debe estar corriendo para funcionalidad completa.

Instalación y Configuración
Clonar el repositorio:

Bash

git clone https://github.com/tu-usuario/levelup-frontend.git
cd levelup-frontend
Instalar dependencias:

Bash

npm install
Configurar conexión al Backend: Verifica el archivo src/services/dataService.js para apuntar a tu servidor API.

Local: http://localhost:8080

Producción (AWS): http://18.223.126.175:8080 (o tu IP actual).

Iniciar servidor de desarrollo:

Bash

npm run dev
La aplicación estará disponible en: http://localhost:5173

🧪 Testing y Cobertura
El proyecto utiliza Vitest para pruebas unitarias y de integración.

Ejecutar pruebas:

Bash

npm run test
Generar reporte de cobertura (Coverage):

Bash

npm run coverage
Esto generará una carpeta coverage/ con un reporte HTML interactivo sobre qué porcentaje del código está testeaedo.
