# Proyecto Six - Biblioteca Digital

Este proyecto es una plataforma de gestión de biblioteca digital, compuesta por un backend en Node.js/Express (carpeta `Api`) y un frontend en React (carpeta `Biblioteca`). Permite la administración de libros, autores, categorías, préstamos y usuarios, con autenticación y panel de administración.

## Tabla de Contenidos
- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Uso](#uso)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Dependencias Instaladas y Propósito](#dependencias-instaladas-y-propósito)
- [Autores](#autores)

---

## Características
- Gestión de usuarios con autenticación y roles (admin/usuario)
- CRUD de libros, autores y categorías
- Gestión de préstamos de libros
- Recuperación de contraseña
- Panel de administración
- Interfaz moderna y responsiva

## Estructura del Proyecto

```
Proyecto_Six/
│
├── Api/                # Backend Node.js/Express
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js     # Configuración de la base de datos
│   │   ├── middleware/
│   │   │   └── auth.js   # Middleware de autenticación
│   │   ├── models/
│   │   │   ├── Author.js     # Modelo de autores
│   │   │   ├── Book.js       # Modelo de libros
│   │   │   ├── Category.js   # Modelo de categorías
│   │   │   ├── Loan.js       # Modelo de préstamos
│   │   │   ├── ResetToken.js # Modelo para recuperación de contraseñas
│   │   │   └── User.js       # Modelo de usuarios
│   │   └── routes/
│   │       ├── admin.js      # Rutas de administración
│   │       ├── auth.js       # Rutas de autenticación
│   │       ├── authors.js    # Rutas de autores
│   │       ├── books.js      # Rutas de libros
│   │       ├── categories.js # Rutas de categorías
│   │       └── loans.js      # Rutas de préstamos
│   ├── package.json          # Dependencias del backend
│   └── server.js             # Archivo principal del servidor
│
├── Biblioteca/         # Frontend React
│   ├── public/
│   │   └── vite.svg         # Logo de Vite
│   ├── src/
│   │   ├── admin/           # Vistas de administración
│   │   │   ├── AdminUsers.jsx       # Gestión de usuarios
│   │   │   ├── EditarAutor.jsx      # Edición de autores
│   │   │   ├── EditarCategoria.jsx  # Edición de categorías
│   │   │   ├── EditarCliente.jsx    # Edición de clientes
│   │   │   ├── EditarLibro.jsx      # Edición de libros
│   │   │   ├── GestionarPrestamos.jsx # Gestión de préstamos
│   │   │   ├── InsertarAutores.jsx  # Inserción de autores
│   │   │   ├── InsertarCategoria.jsx # Inserción de categorías
│   │   │   └── InsertarLibros.jsx   # Inserción de libros
│   │   ├── api/
│   │   │   └── api.js               # Configuración de la API
│   │   ├── components/       # Componentes reutilizables
│   │   │   ├── Footer.jsx          # Pie de página
│   │   │   ├── Header.jsx          # Encabezado
│   │   │   ├── LayOut.jsx          # Diseño general
│   │   │   ├── Navbar.jsx          # Barra de navegación
│   │   │   ├── Rutas.jsx           # Configuración de rutas
│   │   │   ├── ThemeContext.jsx    # Contexto de tema
│   │   │   └── Common/
│   │   │       ├── LoadingSpinner.jsx # Indicador de carga
│   │   │       └── MessageAlert.jsx   # Alertas de mensajes
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Contexto de autenticación
│   │   ├── hooks/
│   │   │   └── useDebounce.js      # Hook personalizado para debounce
│   │   ├── pages/            # Páginas principales
│   │   │   ├── AutoresDashboard.jsx   # Dashboard de autores
│   │   │   ├── CategoriasDashboard.jsx # Dashboard de categorías
│   │   │   ├── Dashboard.jsx          # Dashboard principal
│   │   │   ├── ForgotPassword.jsx     # Recuperación de contraseña
│   │   │   ├── Home.jsx               # Página de inicio
│   │   │   ├── LibrosPorAutor.jsx     # Libros por autor
│   │   │   ├── LibrosPorCategoria.jsx # Libros por categoría
│   │   │   ├── Login.jsx              # Inicio de sesión
│   │   │   ├── Profile.jsx            # Perfil de usuario
│   │   │   ├── Register.jsx           # Registro de usuario
│   │   │   └── SolicitarPrestamo.jsx  # Solicitud de préstamo
│   │   ├── routes/
│   │   │   └── PrivateRoute.jsx       # Rutas privadas
│   │   ├── utils/
│   │   │   └── userHelpers.js         # Utilidades para usuarios
│   ├── package.json          # Dependencias del frontend
│   └── vite.config.js        # Configuración de Vite
└── README.md           # Este archivo
```

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Yefersn15/Proyecto_Six.git
cd Proyecto_Six
```

### 2. Configurar el Backend (Api)

```bash
cd Api
npm install
# Configura las variables de entorno y la conexión a la base de datos en src/config/db.js
npm start
```
El backend corre por defecto en `http://localhost:5000`.

### 3. Configurar el Frontend (Biblioteca)

```bash
cd ../Biblioteca
npm install
npm run dev
```
El frontend corre por defecto en `http://localhost:5173`.

## Uso

1. Regístrate o inicia sesión como usuario o administrador.
2. Accede a las funcionalidades según tu rol:
   - Usuario: ver libros, solicitar préstamos, ver perfil.
   - Admin: gestionar usuarios, libros, autores, categorías y préstamos.
3. Utiliza el panel de administración para CRUD y gestión avanzada.

## Tecnologías Utilizadas

- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** React, Vite, Context API, CSS Modules
- **Autenticación:** JWT
- **Otros:** Vercel (deploy), ESLint

## Dependencias Instaladas y Propósito

### Backend (Api)
- **express**: Framework para construir la API REST.
- **mongoose**: ODM para interactuar con MongoDB.
- **jsonwebtoken**: Manejo de autenticación mediante JWT.
- **bcryptjs**: Encriptación de contraseñas.
- **dotenv**: Manejo de variables de entorno.
- **cors**: Habilitar solicitudes entre dominios.
- **nodemon**: Reinicio automático del servidor en desarrollo.

### Frontend (Biblioteca)
- **react**: Biblioteca para construir la interfaz de usuario.
- **react-router-dom**: Manejo de rutas en la aplicación.
- **vite**: Herramienta de desarrollo rápida para React.
- **axios**: Cliente HTTP para realizar solicitudes a la API.
- **eslint**: Herramienta para mantener un código limpio y consistente.

---
Estas dependencias son esenciales para el correcto funcionamiento del proyecto. Si necesitas instalar nuevas dependencias, asegúrate de incluirlas en el archivo `package.json` correspondiente.

## Autores

- Yeferson (Yefersn15)

---
¡Contribuciones y sugerencias son bienvenidas!