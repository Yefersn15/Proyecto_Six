const mongoose = require('mongoose');

class Author {
  constructor(nombre, apellido, nacionalidad, generoLiterario, biografia, fotografiaUrl, idiomaPrincipal) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.nacionalidad = nacionalidad;
    this.generoLiterario = generoLiterario;
    this.biografia = biografia;
    this.fotografiaUrl = fotografiaUrl;
    this.idiomaPrincipal = idiomaPrincipal;
    this.obrasDestacadas = [];
    this.premios = [];
    this.redesSociales = {};
  }

  get getNombre() { return this.nombre; }
  get getApellido() { return this.apellido; }

  set setObras(obras) { this.obrasDestacadas = obras; }
  set setPremios(premios) { this.premios = premios; }
  set setRedes(redes) { this.redesSociales = redes; }
}

const AuthorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  nacionalidad: { type: String, required: true },
  generoLiterario: { type: String, required: true },
  biografia: { type: String, required: true },
  fotografiaUrl: { type: String, required: true },
  idiomaPrincipal: { type: String, required: true },
  obrasDestacadas: [String],
  premios: [String],
  redesSociales: {
    facebook: String,
    twitter: String,
    instagram: String,
    portafolio: String
  }
}, { timestamps: true });

const AuthorModel = mongoose.model('Author', AuthorSchema);

module.exports = { Author, AuthorModel };