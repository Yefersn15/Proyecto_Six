# Proyecto Six - Biblioteca Digital

Este proyecto es una plataforma de gestión de biblioteca digital, compuesta por un backend en Node.js/Express (carpeta `Api`) y un frontend en React (carpeta `Biblioteca`). Permite la administración de libros, autores, categorías, préstamos y usuarios, con autenticación y panel de administración.

## Tabla de Contenidos
- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Uso](#uso)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Dependencias Instaladas y Propósito](#dependencias-instaladas-y-propósito)
- [Configuración de Archivos .env](#configuración-de-archivos-env)
- [Contribuciones](#contribuciones)

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
├── Api/                # Backend Node.js/Express
├── Biblioteca/         # Frontend React
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
# Configura las variables de entorno en un archivo .env
npm start
```
El backend corre por defecto en `http://localhost:5000`.

### 3. Configurar el Frontend (Biblioteca)

```bash
cd ../Biblioteca
npm install
# Configura las variables de entorno en un archivo .env
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
- **eslint**: Herramienta para mantener un código limpio y consistente.

## Configuración de Archivos .env

Para que el proyecto funcione correctamente, es necesario crear archivos `.env` tanto para el backend como para el frontend. A continuación, se describen los pasos:

### Backend (Api)
1. En la carpeta `Api/`, crea un archivo llamado `.env`.
2. Agrega las siguientes variables de entorno:

```env
PORT=5000
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/<base_de_datos>
JWT_SECRET=tu_secreto_jwt
EMAILJS_SERVICE_ID=tu_service_id
EMAILJS_TEMPLATE_ID=tu_template_id
EMAILJS_PUBLIC_KEY=tu_public_key
```

### Frontend (Biblioteca)
1. En la carpeta `Biblioteca/`, crea un archivo llamado `.env`.
2. Agrega las siguientes variables de entorno:

```env
VITE_API_URL=http://localhost:5000
VITE_EMAILJS_SERVICE_ID=tu_service_id_de_emailjs
VITE_EMAILJS_TEMPLATE_ID=tu_template_id_de_emailjs
VITE_EMAILJS_PUBLIC_KEY=tu_public_key_de_emailjs
```

---
Asegúrate de no incluir estos archivos en el repositorio añadiéndolos al archivo `.gitignore`. Esto protege tu información sensible.

## Contribuciones

¡Contribuciones y sugerencias son bienvenidas! Si encuentras algún problema o tienes ideas para mejorar el proyecto, no dudes en abrir un issue o enviar un pull request.