# API - Backend

Este directorio contiene el backend del proyecto, desarrollado con Node.js y Express. Aquí se gestionan las operaciones del servidor, la conexión a la base de datos y las rutas de la API.

## Instalación

1. Asegúrate de tener Node.js instalado en tu sistema.
2. Navega al directorio `Api`:

```bash
cd Api
```

3. Instala las dependencias:

```bash
npm install
```

4. Configura las variables de entorno creando un archivo `.env` en el directorio `Api` con el siguiente contenido:

```env
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/<base_de_datos>
JWT_SECRET=tu_secreto_jwt
PORT=5000

# Configuración de EmailJS para el BACKEND
EMAILJS_SERVICE_ID=tu_service_id
EMAILJS_TEMPLATE_ID=tu_template_id
EMAILJS_PUBLIC_KEY=tu_public_key
EMAILJS_FROM_NAME=Sistema de Recuperación
```

5. Inicia el servidor:

```bash
npm start
```

El servidor estará disponible en `http://localhost:5000`.

## Dependencias

### Dependencias principales
- **@emailjs/browser**: Envío de correos electrónicos desde el navegador.
- **axios**: Cliente HTTP para realizar solicitudes a la API.
- **bcryptjs**: Encriptación de contraseñas.
- **cors**: Habilitar solicitudes entre dominios.
- **dotenv**: Manejo de variables de entorno.
- **express**: Framework para construir la API REST.
- **jsonwebtoken**: Manejo de autenticación mediante JWT.
- **mongoose**: ODM para interactuar con MongoDB.
- **nodemailer**: Envío de correos electrónicos desde el servidor.

### Dependencias de desarrollo
- **nodemon**: Reinicio automático del servidor en desarrollo.

## Estructura del Proyecto

```
Api/
├── src/
│   ├── config/
│   │   └── db.js          # Configuración de la base de datos
│   ├── middleware/
│   │   └── auth.js        # Middleware de autenticación
│   ├── models/
│   │   ├── Author.js      # Modelo de autores
│   │   ├── Book.js        # Modelo de libros
│   │   ├── Category.js    # Modelo de categorías
│   │   ├── Loan.js        # Modelo de préstamos
│   │   ├── ResetToken.js  # Modelo para recuperación de contraseñas
│   │   └── User.js        # Modelo de usuarios
│   └── routes/
│       ├── admin.js       # Rutas de administración
│       ├── auth.js        # Rutas de autenticación
│       ├── authors.js     # Rutas de autores
│       ├── books.js       # Rutas de libros
│       ├── categories.js  # Rutas de categorías
│       └── loans.js       # Rutas de préstamos
├── package.json           # Dependencias del backend
└── server.js              # Archivo principal del servidor
```

## Notas

- Asegúrate de configurar correctamente las variables de entorno para que el servidor funcione correctamente.
- No olvides proteger el archivo `.env` añadiéndolo al `.gitignore`.