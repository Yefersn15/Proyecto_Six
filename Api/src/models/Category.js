const mongoose = require('mongoose');

class Category {
  constructor(nombre, descripcion = '') {
    this.nombre = nombre;
    this.descripcion = descripcion;
  }

  get getNombre() { return this.nombre; }
  set setDescripcion(d) { this.descripcion = d; }
}

const CategorySchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  descripcion: { type: String }
}, { timestamps: true });

const CategoryModel = mongoose.model('Category', CategorySchema);

module.exports = { Category, CategoryModel };