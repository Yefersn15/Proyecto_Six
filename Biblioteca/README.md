# Biblioteca - Frontend

Este directorio contiene el frontend del proyecto, desarrollado con React y Vite. Aquí se gestiona la interfaz de usuario y la interacción con el backend.

## Instalación

1. Asegúrate de tener Node.js instalado en tu sistema.
2. Navega al directorio `Biblioteca`:

```bash
cd Biblioteca
```

3. Instala las dependencias:

```bash
npm install
```

4. Configura las variables de entorno creando un archivo `.env` en el directorio `Biblioteca` con el siguiente contenido:

```env
# Configuración de EmailJS para recuperación de contraseña
VITE_API_URL=http://localhost:5000
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_TEMPLATE_ID=tu_template_id
VITE_EMAILJS_PUBLIC_KEY=tu_public_key
```

5. Inicia el servidor de desarrollo:

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:5173`.

## Dependencias

### Dependencias principales
- **@emailjs/browser**: Envío de correos electrónicos desde el navegador.
- **bootstrap**: Framework CSS para diseño responsivo.
- **react**: Biblioteca para construir la interfaz de usuario.
- **react-dom**: Renderizado de componentes React en el DOM.
- **react-router-dom**: Manejo de rutas en la aplicación.

### Dependencias de desarrollo
- **@eslint/js**: Configuración de ESLint.
- **@types/react**: Tipos para React en TypeScript.
- **@types/react-dom**: Tipos para ReactDOM en TypeScript.
- **@vitejs/plugin-react**: Plugin de Vite para React.
- **eslint**: Herramienta para mantener un código limpio y consistente.
- **eslint-plugin-react-hooks**: Reglas de ESLint para hooks de React.
- **eslint-plugin-react-refresh**: Reglas de ESLint para React Refresh.
- **gh-pages**: Publicación de aplicaciones en GitHub Pages.
- **globals**: Variables globales para ESLint.
- **vite**: Herramienta de desarrollo rápida para React.

## Estructura del Proyecto

```
Biblioteca/
├── public/
│   └── vite.svg           # Logo de Vite
├── src/
│   ├── admin/             # Vistas de administración
│   ├── api/
│   │   └── api.js         # Configuración de la API
│   ├── components/        # Componentes reutilizables
│   ├── context/
│   │   └── AuthContext.jsx # Contexto de autenticación
│   ├── hooks/
│   │   └── useDebounce.js # Hook personalizado para debounce
│   ├── pages/             # Páginas principales
│   ├── routes/
│   │   └── PrivateRoute.jsx # Rutas privadas
│   └── utils/
│       └── userHelpers.js # Utilidades para usuarios
├── package.json           # Dependencias del frontend
└── vite.config.js         # Configuración de Vite
```

## Notas

- Asegúrate de configurar correctamente las variables de entorno para que el frontend funcione correctamente.
- No olvides proteger el archivo `.env` añadiéndolo al `.gitignore`.
