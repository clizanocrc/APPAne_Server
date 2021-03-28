const mongoose = require("mongoose");
//Conexion con Mongo
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Base de Datos Online");
  } catch (error) {
    console.log(error);
    throw new Error("Error al conectar Base de Datos");
  }
};

module.exports = { dbConnection };
