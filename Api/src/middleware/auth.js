// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/User');

module.exports = async function (req, res, next) {
  const header = req.header('Authorization');

  if (!header) {
    return res.status(401).json({ msg: 'Acceso denegado, token faltante' });
  }

  const token = header.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'Acceso denegado, token mal formado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // El token fue firmado con { user: { id, rol } }
    req.user = decoded.user;

    // Opcional: cargar el usuario completo desde la BD (sin password)
    try {
      const usuario = await UserModel.findById(req.user.id).select('-password');
      req.userFull = usuario;
    } catch (err) {
      req.userFull = null;
    }

    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ msg: 'Token inválido' });
  }
};