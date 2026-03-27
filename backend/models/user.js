//Aquí está el "molde" (esquema) sobre cómo se guardarán los datos de los usuarios en la base de datos
// Define la estructura, validaciones y reglas para cada campo del usuario
const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Jacques Cousteau",
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Explorador",
  },
  avatar: {
    type: String,
    default:
      "https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg",
    validate: {
      validator: function (v) {
        return /^https?:\/\/(www\.)?[a-zA-Z0-9._~:/?%#[\]@!$&'()*+,;=-]+$/.test(
          v,
        );
      },
      message: "El avatar debe ser una URL válida",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Correo electrónico inválido",
    },
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 30,
    select: false,
  },
});
module.exports = mongoose.model("user", userSchema);
