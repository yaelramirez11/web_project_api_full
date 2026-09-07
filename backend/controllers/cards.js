const Card = require("../models/card"); // Importamos el modelo ("molde" (esquema) de las tarjetas - cards")

// Controlador para obtener TODAS las tarjetas
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.json(cards))
    .catch(next);
};

// Controlador para CREAR tarjetas
const createCards = (req, res, next) => {
  // Paso 1: Extraer datos del req.body
  const { name, link } = req.body;

  // Paso 2: Obtener el owner del req.user (viene del middleware de auth)
  const owner = req.user._id;

  // Paso 3: Crear la tarjeta con los datos
  Card.create({ name, link, owner })
    .then((card) => res.status(201).json(card))
    .catch((err) => {
      // Validación de Mongoose
      if (err.name === "ValidationError") {
        err.statusCode = 400;
        err.message = "Datos inválidos para crear la tarjeta";
      }
      return next(err);
    });
};

// Controlador para ELIMINAR las tarjetas por ID
const deleteCards = (req, res, next) => {
  // Paso 1: Obtener el cardId de los parámetros de la URL (req.params)
  const { cardId } = req.params;

  // Paso 2: Buscar tarjeta por ID
  Card.findById(cardId)
    .orFail(() => {
      const error = new Error("Tarjeta no encontrada");
      error.statusCode = 404;
      throw error;
    })

    // Verificar que el usuario sea el propietario
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        const error = new Error("No tienes permisos para eliminar esta tarjeta");
        error.statusCode = 403;
        throw error;
      }

      // Solo si es el propietario, eliminar
      return Card.findByIdAndDelete(cardId);
    })

    .then(() => res.json({ message: "Tarjeta eliminada correctamente" }))

    .catch((err) => {
      // CastError → ID inválido
      if (err.name === "CastError") {
        err.statusCode = 400;
        err.message = "ID de tarjeta inválido";
      }
      return next(err);
    });
};

// PATCH /cards/:cardId/likes — dar like a una tarjeta
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // agrega _id si no existe
    { new: true },
  )
    .orFail(() => {
      const error = new Error("Tarjeta no encontrada");
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.json(card))
    .catch((err) => {
      if (err.name === "CastError") {
        err.statusCode = 400;
        err.message = "ID de tarjeta inválido";
      }
      return next(err);
    });
};

// DELETE /cards/:cardId/likes — quitar like
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // elimina _id del array
    { new: true },
  )
    .orFail(() => {
      const error = new Error("Tarjeta no encontrada");
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.json(card))
    .catch((err) => {
      if (err.name === "CastError") {
        err.statusCode = 400;
        err.message = "ID de tarjeta inválido";
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCards,
  deleteCards,
  likeCard,
  dislikeCard,
};