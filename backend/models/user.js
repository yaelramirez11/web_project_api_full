//Aquí está el "molde" (esquema) sobre cómo se guardarán los datos de los usuarios en la base de datos
// Define la estructura, validaciones y reglas para cada campo del usuario
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^https?:\/\/(www\.)?[a-zA-Z0-9._~:/?%#[\]@!$&'()*+,;=-]+$/.test(
          v,
        );
      },
      message: "El avatar debe ser una URL válida",
    },
  },
});
module.exports = mongoose.model("user", userSchema);
