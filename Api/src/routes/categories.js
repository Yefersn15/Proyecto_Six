const express = require('express');
const { CategoryModel } = require('../models/Category');
const auth = require('../middleware/auth');

const router = express.Router();

// Crear categoría (admin/bibliotecario)
router.post('/', auth, async (req, res) => {
  try {
    if (!['admin', 'bibliotecario'].includes(req.user.rol)) {
      return res.status(403).json({ msg: 'Acceso denegado' });
    }
    const cat = await CategoryModel.create(req.body);
    res.status(201).json(cat);
  } catch (err) {
    console.error('Error creando categoría:', err);
    res.status(500).json({ msg: 'Error al crear categoría' });
  }
});

// Listar categorías (público) con búsqueda y ordenamiento
router.get('/', async (req, res) => {
  try {
    const { q, sort } = req.query;
    const filtro = {};

    // Búsqueda por texto
    if (q) {
      filtro.$or = [
        { nombre: { $regex: q, $options: 'i' } },
        { descripcion: { $regex: q, $options: 'i' } }
      ];
    }

    // Opciones de ordenamiento
    let sortOptions = {};
    if (sort) {
      if (sort === 'nombre') sortOptions = { nombre: 1 };
      else if (sort === '-nombre') sortOptions = { nombre: -1 };
    } else {
      sortOptions = { nombre: 1 }; // Orden alfabético por defecto
    }

    const categorias = await CategoryModel.find(filtro).sort(sortOptions);
    res.json(categorias);
  } catch (err) {
    console.error('Error listando categorías:', err);
    res.status(500).json({ msg: 'Error al listar categorías' });
  }
});

// Obtener categoría por id
router.get('/:id', async (req, res) => {
  try {
    const cat = await CategoryModel.findById(req.params.id);
    if (!cat) return res.status(404).json({ msg: 'Categoría no encontrada' });
    res.json(cat);
  } catch (err) {
    console.error('Error obteniendo categoría:', err);
    res.status(500).json({ msg: 'Error al obtener categoría' });
  }
});

// Actualizar categoría (admin/bibliotecario)
router.put('/:id', auth, async (req, res) => {
  try {
    if (!['admin', 'bibliotecario'].includes(req.user.rol)) {
      return res.status(403).json({ msg: 'Acceso denegado' });
    }
    const cat = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cat) return res.status(404).json({ msg: 'Categoría no encontrada' });
    res.json(cat);
  } catch (err) {
    console.error('Error actualizando categoría:', err);
    res.status(500).json({ msg: 'Error al actualizar categoría' });
  }
});

// Eliminar categoría (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ msg: 'Acceso denegado' });
    }
    const eliminado = await CategoryModel.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ msg: 'Categoría no encontrada' });
    res.json({ msg: 'Categoría eliminada' });
  } catch (err) {
    console.error('Error eliminando categoría:', err);
    res.status(500).json({ msg: 'Error al eliminar categoría' });
  }
});

module.exports = router;