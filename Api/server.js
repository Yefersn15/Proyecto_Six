// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

const app = express();
app.use(express.json());
app.use(cors());

// Conectar DB
connectDB();

// Rutas
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/authors", require("./src/routes/authors"));
app.use("/api/books", require("./src/routes/books"));
app.use("/api/categories", require("./src/routes/categories"));
app.use("/api/loans", require("./src/routes/loans"));
app.use("/api/admin", require("./src/routes/admin"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));