// src/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios'); 
const { UserModel } = require('../models/User');
const ResetTokenModel = require('../models/ResetToken');
const auth = require('../middleware/auth');

const router = express.Router();

/* 🔧 Verificar configuración EmailJS al cargar */
console.log('🔧 Verificando configuración EmailJS:');
console.log('   Service ID:', process.env.EMAILJS_SERVICE_ID ? '✅' : '❌');
console.log('   Template ID:', process.env.EMAILJS_TEMPLATE_ID ? '✅' : '❌');
console.log('   Public Key:', process.env.EMAILJS_PUBLIC_KEY ? '✅' : '❌');
console.log('   From Name:', process.env.EMAILJS_FROM_NAME ? '✅' : '❌');

/* 📩 Función para enviar email (por ahora no se usa en forgot-password, lo maneja el frontend) */
const sendRecoveryEmail = async (email, code, userName) => {
  try {
    const emailData = {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY, // ✅ Usar PUBLIC_KEY
      template_params: {
        email: email,
        user_name: userName,
        reset_code: code,
        app_name: process.env.EMAILJS_FROM_NAME
      }
    };

    console.log('📤 Enviando email a:', email);
    console.log('🔑 Código generado:', code);
    console.log('🔍 Datos que se envían a EmailJS:', emailData);

    await axios.post('https://api.emailjs.com/api/v1.0/email/send', emailData);
    console.log('✅ Email enviado correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error enviando email:', error.response?.data || error.message);
    return false;
  }
};

/* Registro de usuario */
router.post('/register', async (req, res) => {
  try {
    const {
      nombre,
      apellidos,
      email,
      password,
      confirmPassword,
      genero,
      tipoDocumento,
      documento,
      celular,
      direccion,
      barrio,
      avatar
    } = req.body;

    if (
      !nombre || !apellidos || !email || !password || !confirmPassword ||
      !genero || !tipoDocumento || !documento || !celular ||
      !direccion || !barrio
    ) {
      return res.status(400).json({ msg: 'Faltan datos obligatorios' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: 'Las contraseñas no coinciden' });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: 'La contraseña debe tener al menos 6 caracteres' });
    }

    let user = await UserModel.findOne({ $or: [{ email }, { documento }, { celular }] });
    if (user) {
      if (user.email === email) {
        return res.status(400).json({ msg: 'El email ya está registrado' });
      } else if (user.documento === documento) {
        return res.status(400).json({ msg: 'El documento ya está registrado' });
      } else if (user.celular === celular) {
        return res.status(400).json({ msg: 'El número de celular ya está registrado' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    user = new UserModel({
      nombre,
      apellidos,
      email,
      password: hash,
      genero,
      tipoDocumento,
      documento,
      celular,
      direccion,
      barrio,
      avatar
    });

    await user.save();

    const payload = { user: { id: user._id, rol: user.rol } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' });

    res.status(201).json({
      token,
      usuario: {
        id: user._id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        rol: user.rol,
        genero: user.genero,
        tipoDocumento: user.tipoDocumento,
        documento: user.documento,
        celular: user.celular,
        direccion: user.direccion,
        barrio: user.barrio,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      if (err.keyPattern.email) {
        return res.status(400).json({ msg: 'El email ya está registrado' });
      } else if (err.keyPattern.documento) {
        return res.status(400).json({ msg: 'El documento ya está registrado' });
      } else if (err.keyPattern.celular) {
        return res.status(400).json({ msg: 'El número de celular ya está registrado' });
      }
    }
    res.status(500).json({ msg: 'Error en registro' });
  }
});

/* Login de usuario */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Credenciales incorrectas' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Credenciales incorrectas' });

    const payload = { user: { id: user._id, rol: user.rol } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' });

    res.json({
      token,
      usuario: {
        id: user._id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        rol: user.rol,
        genero: user.genero,
        tipoDocumento: user.tipoDocumento,
        documento: user.documento,
        celular: user.celular,
        direccion: user.direccion,
        barrio: user.barrio,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error en login' });
  }
});

/* Obtener perfil */
router.get('/me', auth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener usuario' });
  }
});

/* Actualizar perfil propio */
router.put('/me', auth, async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // 🔥 IMPEDIR que usuarios normales modifiquen el email
    if (updates.email && req.user.rol !== 'admin') {
      return res.status(403).json({ 
        msg: 'No tienes permisos para modificar el email. Contacta a un administrador.' 
      });
    }
    
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    if (updates.celular) {
      const existingUser = await UserModel.findOne({
        celular: updates.celular,
        _id: { $ne: req.user.id }
      });
      if (existingUser) {
        return res.status(400).json({ msg: 'El número de celular ya está en uso por otro usuario' });
      }
    }

    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al actualizar perfil' });
  }
});

/* 🔐 Recuperación de contraseña - Ahora el frontend envía el email */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: 'Email requerido' });

    const user = await UserModel.findOne({ email });
    
    // 🔥 CAMBIO: Ahora devolvemos error si el usuario no existe
    if (!user) {
      return res.status(404).json({ 
        success: false,
        msg: 'Usuario inexistente. Código no enviado.' 
      });
    }

    // Generar código real
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const codeHash = await bcrypt.hash(code, salt);

    // Limpiar códigos anteriores y guardar nuevo
    await ResetTokenModel.deleteMany({ user: user._id, used: false });
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await ResetTokenModel.create({ user: user._id, codeHash, expiresAt });

    // 🔥 El frontend se encarga del envío del email
    res.json({
      success: true,
      message: 'Código generado correctamente',
      code: code, 
      userName: user.nombre || user.email.split('@')[0]
    });

  } catch (err) {
    console.error('❌ Error en forgot-password:', err);
    res.status(500).json({ msg: 'Error al generar código de recuperación' });
  }
});

/* Verificar código sin cambiar contraseña */
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ msg: 'Email y código requeridos' });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    const tokenDoc = await ResetTokenModel.findOne({
      user: user._id,
      used: false,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (!tokenDoc) {
      return res.status(400).json({ msg: 'Código inválido o expirado' });
    }

    const match = await bcrypt.compare(code, tokenDoc.codeHash);
    if (!match) {
      return res.status(400).json({ msg: 'Código incorrecto' });
    }

    res.json({
      success: true,
      message: 'Código verificado correctamente'
    });
  } catch (err) {
    console.error('❌ Error en verify-code:', err);
    res.status(500).json({ msg: 'Error al verificar código' });
  }
});

/* Resetear contraseña */
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ msg: 'Faltan datos requeridos' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ msg: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    const tokenDoc = await ResetTokenModel.findOne({
      user: user._id,
      used: false,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (!tokenDoc) {
      return res.status(400).json({ msg: 'Código inválido o expirado' });
    }

    const match = await bcrypt.compare(code, tokenDoc.codeHash);
    if (!match) {
      return res.status(400).json({ msg: 'Código incorrecto' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    tokenDoc.used = true;
    await tokenDoc.save();

    res.json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });
  } catch (err) {
    console.error('❌ Error en reset-password:', err);
    res.status(500).json({ msg: 'Error al restablecer la contraseña' });
  }
});

module.exports = router;