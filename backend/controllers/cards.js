const Card = require("../models/card"); // Importamos el modelo ("molde" (esquema) de las tarjetas - cards)

// Controlador para obtener TODAS las tarjetas
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.json(cards))
    .catch((err) => res.status(500).json({ message: "Error del servidor" }));
};

// Controlador para CREAR tarjetas
const createCards = (req, res) => {
  // Paso 1: Extraer datos del req.body
  const { name, link } = req.body;
  // Paso 2: Obtener el owner del req.user (viene del middleware temporal)
  const owner = req.user._id;
  // Paso 3: Crear la tarjeta con los datos
  Card.create({ name, link, owner })
    .then((card) => res.status(201).json(card))
    .catch((err) => {
      // Se agrega sentencia IF por si los datos no cumplen las validaciones de Mongoose
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Datos inválidos para crear la tarjeta" });
      }
      return res.status(500).json({ message: "Error del servidor" });
    });
};

// Controlador para ELIMINAR las tarjetas por ID
const deleteCards = (req, res) => {
  // Paso 1: Obtener el cardId de los parámetros de la URL (req.params)
  const { cardId } = req.params;
  // Paso 2: Usar un método de Mongoose para eliminar por ID, orFail() en deleteCards asegura que si la card no existe, entra al .catch() con statusCode = 404.
  Card.findByIdAndDelete(cardId)
    .orFail(() => {
      const error = new Error("Tarjeta no encontrada");
      error.statusCode = 404;
      throw error;
    })
    .then(() => res.json({ message: "Tarjeta eliminada correctamente" }))
    .catch((err) => {
      //CastError → 400 (ID inválido)
      if (err.name === "CastError") {
        return res.status(400).json({ message: "ID de tarjeta inválido" });
      }
      if (err.statusCode === 404) {
        return res.status(404).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error del servidor" });
    });
};

// PATCH /cards/:cardId/likes — dar like a una tarjeta
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // agrega _id al array si aún no está ahí
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
        return res.status(400).json({ message: "ID de tarjeta inválido" });
      }
      if (err.statusCode === 404) {
        return res.status(404).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error del servidor" });
    });
};

// DELETE /cards/:cardId/likes — dar unlike a una tarjeta
const dislikeCard = (req, res) => {
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
        return res.status(400).json({ message: "ID de tarjeta inválido" });
      }
      if (err.statusCode === 404) {
        return res.status(404).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error del servidor" });
    });
};

module.exports = {
  getCards,
  createCards,
  deleteCards,
  likeCard,
  dislikeCard,
};
