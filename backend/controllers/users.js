const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET = "dev-secret" } = process.env;

// GET /users — devuelve todos los usuarios
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.json(users))
    .catch(next);
};

// GET /users/:userId — devuelve un usuario por _id
const getUserById = (req, res, next) => {
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
        err.statusCode = 400;
        err.message = "ID de usuario inválido";
      }
      return next(err);
    });
};

// CREATE USER
const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  if (!password) {
    const error = new Error("La contraseña es requerida");
    error.statusCode = 400;
    return next(error);
  }

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.code === 11000) {
        err.statusCode = 409;
        err.message = "El correo electrónico ya está en uso";
      }

      if (err.name === "ValidationError") {
        err.statusCode = 400;
        err.message = "Datos inválidos para crear el usuario";
      }

      return next(err);
    });
};

// PATCH /users/me — actualizar el perfil
const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.statusCode = 400;
        err.message = "Datos inválidos para actualizar el perfil";
      }

      if (err.name === "CastError") {
        err.statusCode = 400;
        err.message = "ID de usuario inválido";
      }

      return next(err);
    });
};

// PATCH /users/me/avatar — actualizar el avatar
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.statusCode = 400;
        err.message = "Avatar inválido";
      }

      if (err.name === "CastError") {
        err.statusCode = 400;
        err.message = "ID de usuario inválido";
      }

      return next(err);
    });
};

// LOGIN
const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Email y contraseña son requeridos");
    error.statusCode = 400;
    return next(error);
  }

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        const error = new Error("Credenciales incorrectas");
        error.statusCode = 401;
        throw error;
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          const error = new Error("Credenciales incorrectas");
          error.statusCode = 401;
          throw error;
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });

        res.send({ token });
      });
    })
    .catch((err) => next(err));
};

// GET CURRENT USER
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        const error = new Error("Usuario no encontrado");
        error.statusCode = 404;
        throw error;
      }

      res.send(user);
    })
    .catch(next);
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