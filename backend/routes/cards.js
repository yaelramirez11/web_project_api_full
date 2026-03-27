const express = require("express");
const router = express.Router();
const {
  getCards,
  createCards,
  deleteCards,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

// GET /cards
router.get("/", getCards);

// POST /cards
router.post("/", createCards);

// DELETE /cards/:cardId
router.delete("/:cardId", deleteCards);

// NUEVAS rutas para likes
router.put("/:cardId/likes", likeCard); // Dar like
router.delete("/:cardId/likes", dislikeCard); // Quitar like

// Exportamos el router para usarlo en app.js
module.exports = router;

//routes → controllers → models → MongoDB. Ya no se usan archivos JSON. Ahora todo vive en la base de datos aroundb.
