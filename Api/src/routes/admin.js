// src/routes/admin.js
const express = require('express');
const { UserModel } = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Obtener todos los usuarios (solo admin)
router.get('/users', auth, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ msg: 'Acceso denegado. Solo administradores' });
    }

    const users = await UserModel.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener usuarios' });
  }
});

// Cambiar rol de usuario (solo admin)
router.put('/users/:id/role', auth, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ msg: 'Acceso denegado. Solo administradores' });
    }

    const { rol } = req.body;
    if (!['admin', 'bibliotecario', 'usuario'].includes(rol)) {
      return res.status(400).json({ msg: 'Rol no válido' });
    }

    // No permitir que un admin se quite sus propios privilegios
    if (req.params.id === req.user.id && rol !== 'admin') {
      return res.status(400).json({ msg: 'No puedes cambiar tu propio rol' });
    }

    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { rol },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al cambiar rol' });
  }
});

// Actualizar información de usuario (solo admin)
router.put('/users/:id', auth, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ msg: 'Acceso denegado. Solo administradores' });
    }

    const updates = { ...req.body };

    // 🔥 Permitir email, pero nunca contraseña
    delete updates.password;

    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      if (err.keyPattern.email) {
        return res.status(400).json({ msg: 'El email ya está en uso' });
      } else if (err.keyPattern.documento) {
        return res.status(400).json({ msg: 'El documento ya está en uso' });
      } else if (err.keyPattern.celular) {
        return res.status(400).json({ msg: 'El celular ya está en uso' });
      }
    }
    res.status(500).json({ msg: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario (solo admin)
router.delete('/users/:id', auth, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ msg: 'Acceso denegado. Solo administradores' });
    }

    // No permitir que un admin se elimine a sí mismo
    if (req.params.id === req.user.id) {
      return res.status(400).json({ msg: 'No puedes eliminarte a ti mismo' });
    }

    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json({ msg: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al eliminar usuario' });
  }
});

module.exports = router;