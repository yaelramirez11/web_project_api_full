const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET = "dev-secret" } = process.env;

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

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  if (!password) {
    return res.status(400).send({
      message: "La contraseña es requerida",
    });
  }
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      return User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      });
    })
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).send({
          message: "El correo electrónico ya está en uso",
        });
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Datos inválidos para crear el usuario",
        });
      }
      return res.status(500).send({
        message: "Error del servidor",
      });
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

const login = (req, res) => {
  const { email, password } = req.body;
  // 1-. Validación de datos
  if (!email || !password) {
    return res.status(400).send({
      message: "Email y contraseña son requeridos",
    });
  }
  // 2. Buscamos al usuario y su password para después compararlas
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Credenciales incorrectas"));
      }
      // 3. Comparar passwords
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Credenciales incorrectas"));
        }
        // 4. Crear token en caso de que sí coincidan
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        // 5. Enviar token
        return res.send({ token });
      });
    })
    .catch(() => {
      return res.status(401).send({
        message: "Email o contraseña incorrectos",
      });
    });
};

// Controlador para obtener los datos del usuario
const getCurrentUser = (req, res) => {
  // Usa el ID del token. Este valor viene del middleware JWT
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "Usuario no encontrado",
        });
      }
      res.send(user);
    })
    .catch(() => {
      res.status(500).send({
        message: "Error del servidor",
      });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getCurrentUser,
};
