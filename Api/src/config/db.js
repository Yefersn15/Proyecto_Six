const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // opciones por defecto en mongoose 8 ya bien, puedes incluir si quieres:
      // useNewUrlParser: true, useUnifiedTopology: true
    });
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (err) {
    console.error('❌ Error al conectar MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;