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

const {
  validateCard, validateCardId
} = require("../middlewares/validators");

// GET /cards
router.get("/", auth, getCards);

// POST /cards (VALIDADO)
router.post("/", auth, validateCard, createCards);

// DELETE /cards/:cardId
router.delete("/:cardId", auth, validateCardId, deleteCards);

// LIKES
router.put("/:cardId/likes", auth, validateCardId, likeCard);
router.delete("/:cardId/likes", auth, validateCardId, dislikeCard);

module.exports = router;