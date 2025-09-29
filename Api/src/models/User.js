// src/models/User.js
const mongoose = require('mongoose');

class User {
  constructor(nombre, apellidos, email, password, rol = 'usuario', avatar = '', genero = '', tipoDocumento = '', documento = '', celular = '', direccion = '', barrio = '') {
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.email = email;
    this.password = password;
    this.rol = rol;
    this.avatar = avatar;
    this.genero = genero;
    this.tipoDocumento = tipoDocumento;
    this.documento = documento;
    this.celular = celular;
    this.direccion = direccion;
    this.barrio = barrio;
  }

  get getNombre() { return this.nombre; }
  get getEmail() { return this.email; }
  get getRol() { return this.rol; }

  set setNombre(n) { this.nombre = n; }
  set setPassword(p) { this.password = p; }
}

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  genero: {
    type: String,
    enum: ['hombre', 'mujer', 'otro'],
    required: true
  },
  tipoDocumento: {
    type: String,
    enum: ['cc', 'ti', 'pasaporte', 'cedula_extranjera'],
    required: true
  },
  documento: {
    type: String,
    required: true,
    unique: true
  },
  celular: {
    type: String,
    required: true,
    unique: true
  },
  direccion: {
    type: String,
    required: true
  },
  barrio: {
    type: String,
    required: true
  },
  avatar: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  rol: {
    type: String,
    enum: ['admin', 'bibliotecario', 'usuario'],
    default: 'usuario'
  }
}, { timestamps: true });

const UserModel = mongoose.model('User', UserSchema);
module.exports = { User, UserModel };