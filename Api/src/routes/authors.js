// src/routes/authors.js
const express = require('express');
const { AuthorModel } = require('../models/Author');
const auth = require('../middleware/auth');

const router = express.Router();

// Crear autor (admin/bibliotecario)
router.post('/', auth, async (req, res) => {
  try {
    if (!['admin', 'bibliotecario'].includes(req.user.rol)) {
      return res.status(403).json({ msg: 'Acceso denegado' });
    }

    const autor = await AuthorModel.create(req.body);
    res.status(201).json(autor);
  } catch (err) {
    console.error('Error creando autor:', err);
    res.status(500).json({ msg: 'Error al crear autor' });
  }
});

// Listar autores (público) con búsqueda y ordenamiento
router.get('/', async (req, res) => {
  try {
    const { q, sort } = req.query;
    const filtro = {};

    // Búsqueda por texto
    if (q) {
      filtro.$or = [
        { nombre: { $regex: q, $options: 'i' } },
        { apellido: { $regex: q, $options: 'i' } },
        { nacionalidad: { $regex: q, $options: 'i' } }
      ];
    }

    // Opciones de ordenamiento
    let sortOptions = {};
    if (sort) {
      if (sort === 'nombre') sortOptions = { nombre: 1 };
      else if (sort === '-nombre') sortOptions = { nombre: -1 };
      else if (sort === 'apellido') sortOptions = { apellido: 1 };
      else if (sort === '-apellido') sortOptions = { apellido: -1 };
      else if (sort === 'nacionalidad') sortOptions = { nacionalidad: 1 };
    } else {
      sortOptions = { createdAt: -1 }; // Orden por defecto
    }

    const autores = await AuthorModel.find(filtro).sort(sortOptions);
    res.json(autores);
  } catch (err) {
    console.error('Error listando autores:', err);
    res.status(500).json({ msg: 'Error al listar autores' });
  }
});

// Obtener autor por id (público)
router.get('/:id', async (req, res) => {
  try {
    const autor = await AuthorModel.findById(req.params.id);
    if (!autor) {
      return res.status(404).json({ msg: 'Autor no encontrado' });
    }
    res.json(autor);
  } catch (err) {
    console.error('Error obteniendo autor:', err);
    res.status(500).json({ msg: 'Error al obtener autor' });
  }
});

// Actualizar autor (admin/bibliotecario)
router.put('/:id', auth, async (req, res) => {
  try {
    if (!['admin', 'bibliotecario'].includes(req.user.rol)) {
      return res.status(403).json({ msg: 'Acceso denegado' });
    }

    const autor = await AuthorModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!autor) {
      return res.status(404).json({ msg: 'Autor no encontrado' });
    }

    res.json(autor);
  } catch (err) {
    console.error('Error actualizando autor:', err);
    res.status(500).json({ msg: 'Error al actualizar autor' });
  }
});

// Eliminar autor (solo admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ msg: 'Acceso denegado' });
    }

    const eliminado = await AuthorModel.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ msg: 'Autor no encontrado' });
    }

    res.json({ msg: 'Autor eliminado' });
  } catch (err) {
    console.error('Error eliminando autor:', err);
    res.status(500).json({ msg: 'Error al eliminar autor' });
  }
});

module.exports = router;