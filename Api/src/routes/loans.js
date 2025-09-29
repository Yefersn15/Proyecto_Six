// src/routes/loans.js
const express = require('express');
const { LoanModel } = require('../models/Loan');
const { BookModel } = require('../models/Book');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * 📌 Solicitar préstamo (usuario autenticado)
 * body: { libroId }
 */
router.post('/', auth, async (req, res) => {
  try {
    const { libroId } = req.body;
    const libro = await BookModel.findById(libroId);

    if (!libro) return res.status(404).json({ msg: 'Libro no encontrado' });

    // Verificar que el usuario no tenga ya este libro prestado o en espera
    const prestamoExistente = await LoanModel.findOne({
      libro: libroId,
      usuario: req.user.id,
      estado: { $in: ['en espera', 'prestado'] },
    });

    if (prestamoExistente) {
      return res.status(400).json({
        msg: 'Ya tienes este libro prestado o en solicitud',
      });
    }

    // Verificar disponibilidad mínima (aunque igual puede ir a "en espera")
    if (libro.disponibles <= 0) {
      return res.status(400).json({ msg: 'No hay copias disponibles de este libro' });
    }

    // Crear préstamo en estado "en espera"
    const prestamo = await LoanModel.create({
      libro: libro._id,
      usuario: req.user.id,
    });

    res.status(201).json(prestamo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al solicitar préstamo' });
  }
});

/**
 * 📌 Obtener TODOS los préstamos (solo admin/bibliotecario)
 * Incluye información de dirección, barrio, celular y documento del usuario
 */
router.get('/', auth, async (req, res) => {
  try {
    if (!['admin', 'bibliotecario'].includes(req.user.rol)) {
      return res.status(403).json({ msg: 'Acceso denegado' });
    }

    const prestamos = await LoanModel.find()
      .populate('libro', 'titulo portadaUrl isbn')
      .populate(
        'usuario',
        'nombre email rol avatar direccion barrio celular tipoDocumento documento'
      );

    res.json(prestamos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al listar préstamos' });
  }
});

/**
 * 📌 Obtener préstamos del usuario autenticado
 * Incluye autores del libro
 */
router.get('/mis-prestamos', auth, async (req, res) => {
  try {
    const prestamos = await LoanModel.find({ usuario: req.user.id })
      .populate('libro', 'titulo portadaUrl isbn autores');

    res.json(prestamos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener tus préstamos' });
  }
});

/**
 * 📌 Actualizar préstamo (estado, observación, fechaDevolucionReal)
 * body: { estado, observacion, fechaDevolucionReal }
 * Solo admin/bibliotecario
 */
router.put('/:id', auth, async (req, res) => {
  try {
    if (!['admin', 'bibliotecario'].includes(req.user.rol)) {
      return res.status(403).json({ msg: 'Acceso denegado' });
    }

    const { estado, observacion, fechaDevolucionReal } = req.body;
    const prestamo = await LoanModel.findById(req.params.id).populate('libro');

    if (!prestamo) return res.status(404).json({ msg: 'Préstamo no encontrado' });

    // ✅ Si se aprueba el préstamo
    if (estado === 'prestado' && prestamo.estado !== 'prestado') {
      if (prestamo.libro.disponibles <= 0) {
        return res.status(400).json({ msg: 'No hay copias disponibles para prestar' });
      }

      // Reducir disponibles
      await BookModel.findByIdAndUpdate(prestamo.libro._id, {
        $inc: { disponibles: -1 },
      });

      // Si ya no quedan copias, rechazar automáticamente los demás "en espera"
      const libroActualizado = await BookModel.findById(prestamo.libro._id);
      if (libroActualizado.disponibles === 0) {
        await LoanModel.updateMany(
          {
            libro: prestamo.libro._id,
            estado: 'en espera',
            _id: { $ne: prestamo._id },
          },
          {
            estado: 'prestamo rechazado',
            observacion: 'Rechazado por falta de disponibilidad',
          }
        );
      }
    }

    // ✅ Si se registra devolución
    if (fechaDevolucionReal && !prestamo.fechaDevolucionReal) {
      // Aumentar disponibles
      await BookModel.findByIdAndUpdate(prestamo.libro._id, {
        $inc: { disponibles: 1 },
      });

      // Si hay préstamos en espera, aprobar el más antiguo automáticamente
      const libroActualizado = await BookModel.findById(prestamo.libro._id);
      if (libroActualizado.disponibles > 0) {
        const prestamoEnEspera = await LoanModel.findOne({
          libro: prestamo.libro._id,
          estado: 'en espera',
        }).sort({ createdAt: 1 });

        if (prestamoEnEspera) {
          await LoanModel.findByIdAndUpdate(prestamoEnEspera._id, {
            estado: 'prestado',
          });

          await BookModel.findByIdAndUpdate(prestamo.libro._id, {
            $inc: { disponibles: -1 },
          });
        }
      }
    }

    // ✅ Actualizar campos básicos del préstamo
    const updates = {};
    if (estado) updates.estado = estado;
    if (observacion) updates.observacion = observacion;
    if (fechaDevolucionReal) updates.fechaDevolucionReal = fechaDevolucionReal;

    const prestamoActualizado = await LoanModel.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    )
      .populate('libro', 'titulo portadaUrl isbn')
      .populate(
        'usuario',
        'nombre email rol avatar direccion barrio celular tipoDocumento documento'
      );

    res.json(prestamoActualizado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al actualizar préstamo' });
  }
});

/**
 * 📌 Eliminar préstamo (solo admin)
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ msg: 'Acceso denegado' });
    }

    const eliminado = await LoanModel.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ msg: 'Préstamo no encontrado' });

    res.json({ msg: 'Préstamo eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al eliminar préstamo' });
  }
});

module.exports = router;