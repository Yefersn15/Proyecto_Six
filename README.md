# Proyecto Six - Biblioteca Digital

Este proyecto es una plataforma de gestión de biblioteca digital, compuesta por un backend en Node.js/Express (carpeta `Api`) y un frontend en React (carpeta `Biblioteca`). Permite la administración de libros, autores, categorías, préstamos y usuarios, con autenticación y panel de administración.

## Tabla de Contenidos
- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Crear el Proyecto desde Cero](#crear-el-proyecto-desde-cero)
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

1. Navega al directorio `Api`:

```bash
cd Api
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno creando un archivo `.env` con el siguiente contenido:

```env
PORT=5000
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/<base_de_datos>
JWT_SECRET=tu_secreto_jwt
EMAILJS_SERVICE_ID=tu_service_id
EMAILJS_TEMPLATE_ID=tu_template_id
EMAILJS_PUBLIC_KEY=tu_public_key
```

4. Inicia el servidor:

```bash
npm run dev
```

El backend estará disponible en `http://localhost:5000`.

### 3. Configurar el Frontend (Biblioteca)

1. Navega al directorio `Biblioteca`:

```bash
cd ../Biblioteca
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno creando un archivo `.env` con el siguiente contenido:

```env
VITE_API_URL=http://localhost:5000
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_TEMPLATE_ID=tu_template_id
VITE_EMAILJS_PUBLIC_KEY=tu_public_key
```

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`.

## Crear el Proyecto desde Cero

Si deseas crear este proyecto desde cero, sigue estos pasos:

### 1. Configurar el Backend (Api)

1. Crea una carpeta para el backend y navega a ella:

```bash
mkdir Api
cd Api
```

2. Inicializa un proyecto de Node.js:

```bash
npm init -y
```

3. Instala las dependencias necesarias:

```bash
npm install express mongoose cors dotenv bcryptjs jsonwebtoken nodemailer
npm install -D nodemon
```

4. Crea la estructura de carpetas:

```
Api/
├── src/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   └── routes/
├── .env
├── package.json
└── server.js
```

5. Configura el archivo `server.js` para inicializar el servidor y conectar a MongoDB.

6. Crea las rutas, modelos y controladores necesarios para la API.

### 2. Configurar el Frontend (Biblioteca)

1. Crea una carpeta para el frontend y navega a ella:

```bash
mkdir Biblioteca
cd Biblioteca
```

2. Inicializa un proyecto de Vite:

```bash
npm create vite@latest . -- --template react
```

3. Instala las dependencias necesarias:

```bash
npm install react-router-dom bootstrap @emailjs/browser
npm install -D eslint @vitejs/plugin-react
```

4. Crea la estructura de carpetas:

```
Biblioteca/
├── public/
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── routes/
│   └── utils/
├── .env
├── package.json
└── vite.config.js
```

5. Configura el archivo `vite.config.js` y las rutas en `src/routes`.

6. Desarrolla los componentes y páginas necesarios para la aplicación.

### 3. Configurar los Archivos `.env`

Asegúrate de crear los archivos `.env` tanto en el backend como en el frontend con las variables necesarias para conectar con la base de datos y servicios externos.

---

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
- **nodemailer**: Envío de correos electrónicos desde el servidor.
- **nodemon**: Reinicio automático del servidor en desarrollo.

### Frontend (Biblioteca)
- **react**: Biblioteca para construir la interfaz de usuario.
- **react-router-dom**: Manejo de rutas en la aplicación.
- **vite**: Herramienta de desarrollo rápida para React.
- **eslint**: Herramienta para mantener un código limpio y consistente.
- **bootstrap**: Framework CSS para diseño responsivo.
- **@emailjs/browser**: Envío de correos electrónicos desde el navegador.

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
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_TEMPLATE_ID=tu_template_id
VITE_EMAILJS_PUBLIC_KEY=tu_public_key
```

---
Asegúrate de no incluir estos archivos en el repositorio añadiéndolos al archivo `.gitignore`. Esto protege tu información sensible.

## Contribuciones

¡Contribuciones y sugerencias son bienvenidas! Si encuentras algún problema o tienes ideas para mejorar el proyecto, no dudes en abrir un issue o enviar un pull request.
