const mongoose = require('mongoose');

class Loan {
  constructor(libro, usuario) {
    this.libro = libro;
    this.usuario = usuario;
  }
}

const LoanSchema = new mongoose.Schema({
  libro: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fechaPrestamo: { type: Date, default: Date.now },
  fechaDevolucion: {
    type: Date,
    default: () => {
      const f = new Date();
      f.setDate(f.getDate() + 7);
      return f;
    }
  },
  fechaDevolucionReal: { type: Date },
  observacion: { type: String },
  estado: { type: String, enum: ['en espera', 'prestado', 'prestamo rechazado'], default: 'en espera' }
}, { timestamps: true });

const LoanModel = mongoose.model('Loan', LoanSchema);

module.exports = { Loan, LoanModel };