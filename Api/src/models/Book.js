const mongoose = require('mongoose');

class Book {
  constructor(titulo, autores, descripcion, isbn, portadaUrl, idioma, categorias = []) {
    this.titulo = titulo;
    this.autores = autores; // array de ObjectId
    this.descripcion = descripcion;
    this.isbn = isbn;
    this.portadaUrl = portadaUrl;
    this.idioma = idioma;
    this.categorias = categorias;
    this.copias = 1;
    this.disponibles = 1;
  }

  get getTitulo() { return this.titulo; }
  set setTitulo(t) { this.titulo = t; }
}

const BookSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true }],
  descripcion: { type: String },
  isbn: { type: String, unique: true, sparse: true },
  portadaUrl: { type: String },
  archivoUrl: { type: String },
  idioma: { type: String, required: true },
  categorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  etiquetas: [String],
  paginas: Number,
  copias: { type: Number, default: 1 },
  disponibles: { type: Number, default: 1 }
}, { timestamps: true });

BookSchema.index({ titulo: 'text', descripcion: 'text' });

const BookModel = mongoose.model('Book', BookSchema);

module.exports = { Book, BookModel };