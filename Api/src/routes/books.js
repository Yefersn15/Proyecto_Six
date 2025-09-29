const express = require('express');
const { BookModel } = require('../models/Book');
const { AuthorModel } = require('../models/Author');
const auth = require('../middleware/auth');

const router = express.Router();

// Crear libro (admin/bibliotecario)
router.post('/', auth, async (req, res) => {
  try {
    if (!['admin', 'bibliotecario'].includes(req.user.rol)) {
      return res.status(403).json({ msg: 'Acceso denegado' });
    }

    // Verificar que los autores existan
    const { autores = [] } = req.body;
    if (!Array.isArray(autores) || autores.length === 0) {
      return res.status(400).json({ msg: 'Debe indicar al menos un autor (array de IDs)' });
    }

    const encontrados = await AuthorModel.find({ _id: { $in: autores } });
    if (encontrados.length !== autores.length) {
      return res.status(400).json({ msg: 'Alguno de los autores no existe' });
    }

    const libro = await BookModel.create(req.body);
    res.status(201).json(libro);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al crear libro' });
  }
});

// Listar libros (público) con paginación, búsqueda y ordenamiento
router.get('/', async (req, res) => {
  try {
    const { q, categoria, page = 1, limit = 10, sort } = req.query;
    const filtro = {};

    // Filtro por búsqueda de texto
    if (q) {
      filtro.$or = [
        { titulo: { $regex: q, $options: 'i' } },
        { descripcion: { $regex: q, $options: 'i' } }
      ];
    }

    // Filtro por categoría
    if (categoria) filtro.categorias = categoria;

    // Opciones de ordenamiento
    let sortOptions = {};
    if (sort) {
      if (sort === 'titulo') sortOptions = { titulo: 1 };
      else if (sort === '-titulo') sortOptions = { titulo: -1 };
      else if (sort === 'disponibles') sortOptions = { disponibles: -1 };
      else if (sort === '-disponibles') sortOptions = { disponibles: 1 };
    } else {
      sortOptions = { createdAt: -1 }; // Orden por defecto
    }

    const libros = await BookModel.find(filtro)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('autores', 'nombre apellido fotografiaUrl')
      .populate('categorias', 'nombre');

    res.json(libros);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al listar libros' });
  }
});

// Obtener libro por id
router.get('/:id', async (req, res) => {
  try {
    const libro = await BookModel.findById(req.params.id)
      .populate('autores', 'nombre apellido biografia fotografiaUrl idiomaPrincipal')
      .populate('categorias', 'nombre');
    if (!libro) return res.status(404).json({ msg: 'Libro no encontrado' });
    res.json(libro);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener libro' });
  }
});

// Actualizar libro (admin/bibliotecario)
router.put('/:id', auth, async (req, res) => {
  try {
    if (!['admin', 'bibliotecario'].includes(req.user.rol)) {
      return res.status(403).json({ msg: 'Acceso denegado' });
    }

    if (req.body.autores) {
      const encontrados = await AuthorModel.find({ _id: { $in: req.body.autores } });
      if (encontrados.length !== req.body.autores.length) {
        return res.status(400).json({ msg: 'Alguno de los autores no existe' });
      }
    }

    const libro = await BookModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!libro) return res.status(404).json({ msg: 'Libro no encontrado' });
    res.json(libro);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al actualizar libro' });
  }
});

// Eliminar libro (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ msg: 'Solo administradores pueden eliminar libros' });
    }

    const eliminado = await BookModel.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ msg: 'Libro no encontrado' });
    res.json({ msg: 'Libro eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al eliminar libro' });
  }
});

module.exports = router;