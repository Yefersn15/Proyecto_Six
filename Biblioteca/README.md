# Biblioteca - Frontend

Este directorio contiene el frontend del proyecto, desarrollado con React y Vite. Aquí se gestiona la interfaz de usuario y la interacción con el backend.

## Tabla de Contenidos

1. [Instalación](#instalación)
2. [Conexión con el Backend](#conexión-con-el-backend)
3. [Dependencias](#dependencias)
    - [Dependencias principales](#dependencias-principales)
    - [Dependencias de desarrollo](#dependencias-de-desarrollo)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Crear el Proyecto desde Cero](#crear-el-proyecto-desde-cero)
6. [Notas](#notas)

## Instalación

1. Asegúrate de tener Node.js instalado en tu sistema.
2. Clona este repositorio y navega al directorio `Biblioteca`:

```bash
cd Biblioteca
```

3. Instala las dependencias necesarias:

```bash
npm install
```

4. Configura las variables de entorno creando un archivo `.env` en el directorio `Biblioteca` con el siguiente contenido:

```env
# Configuración de la API y servicios externos
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

## Conexión con el Backend

El frontend se conecta al backend mediante las funciones definidas en `src/api/api.js`. Estas funciones utilizan `fetch` para realizar solicitudes HTTP a la API alojada en `http://localhost:5000/api`. A continuación, se describen las funciones principales:

- **apiGet(endpoint, token)**: Realiza una solicitud GET al endpoint especificado.
- **apiPost(endpoint, data, token)**: Realiza una solicitud POST con los datos proporcionados.
- **apiPut(endpoint, data, token)**: Realiza una solicitud PUT para actualizar datos.
- **apiDelete(endpoint, token)**: Realiza una solicitud DELETE para eliminar datos.

Cada función incluye soporte para autenticación mediante tokens JWT, que se envían en el encabezado `Authorization`.

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

## Crear el Proyecto desde Cero

Si deseas crear un proyecto similar desde cero, sigue estos pasos:

1. **Inicializa un nuevo proyecto con Vite:**

```bash
npm create vite@latest Biblioteca -- --template react
>> cd Biblioteca
```

Selecciona las opciones para React y JavaScript.

2. **Instala las dependencias necesarias:**

```bash
npm install react react-dom react-router-dom bootstrap @emailjs/browser
```

3. **Configura ESLint y otras herramientas de desarrollo:**

```bash
npm install -D eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh @vitejs/plugin-react
```

4. **Crea la estructura de carpetas:**

Organiza las carpetas como se muestra en la sección "Estructura del Proyecto".

5. **Configura el archivo `.env`:**

Añade las variables de entorno necesarias para conectar con el backend y servicios externos.

6. **Desarrolla los componentes y páginas:**

Crea los componentes y páginas necesarios para tu aplicación.

7. **Configura la conexión con el backend:**

Implementa las funciones de la API en `src/api/api.js` para interactuar con el backend.

8. **Ejecuta el servidor de desarrollo:**

```bash
npm run dev
```

¡Tu proyecto estará listo para ser desarrollado y desplegado! 

## Notas

- Asegúrate de proteger el archivo `.env` añadiéndolo al `.gitignore`.
- Sigue las mejores prácticas de desarrollo para mantener el código limpio y organizado.