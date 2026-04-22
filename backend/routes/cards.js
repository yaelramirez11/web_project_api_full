const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  getCards,
  createCards,
  deleteCards,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

// GET /cards
router.get("/", auth, getCards);

// POST /cards
router.post("/", auth, createCards);

// DELETE /cards/:cardId
router.delete("/:cardId", auth, deleteCards);

// NUEVAS rutas para likes
router.put("/:cardId/likes", auth, likeCard); // Dar like
router.delete("/:cardId/likes", auth, dislikeCard); // Quitar like

// Exportamos el router para usarlo en app.js
module.exports = router;

//routes → controllers → models → MongoDB. Ya no se usan archivos JSON. Ahora todo vive en la base de datos aroundb.
