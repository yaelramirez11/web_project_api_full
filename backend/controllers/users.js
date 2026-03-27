const User = require("../models/user");

// GET /users — devuelve todos los usuarios
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.json(users))
    .catch(() => res.status(500).json({ message: "Error del servidor" }));
};

// GET /users/:userId — devuelve un usuario por _id
const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).json({ message: "ID de usuario inválido" });
      }
      if (err.statusCode === 404) {
        return res.status(404).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error del servidor" });
    });
};

// POST /users — crea un nuevo usuario
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).json(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Datos inválidos para crear el usuario" });
      }
      return res.status(500).json({ message: "Error del servidor" });
    });
};

// PATCH /users/me — actualizar el perfil
const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Datos inválidos para actualizar el perfil" });
      }
      if (err.name === "CastError") {
        return res.status(400).json({ message: "ID de usuario inválido" });
      }
      if (err.statusCode === 404) {
        return res.status(404).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error del servidor" });
    });
};

// PATCH /users/me/avatar — actualizar el avatar
const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: "Avatar inválido" });
      }
      if (err.name === "CastError") {
        return res.status(400).json({ message: "ID de usuario inválido" });
      }
      if (err.statusCode === 404) {
        return res.status(404).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error del servidor" });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
