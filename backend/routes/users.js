const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require("../controllers/users");

// GET /users
router.get("/", getUsers);

// GET /users/:userId
router.get("/:userId", getUserById);

// POST /users
router.post("/", createUser);

// NUEVAS rutas para actualizar perfil y avatar
router.patch("/me", updateProfile); // Actualizar perfil
router.patch("/me/avatar", updateAvatar); // Actualizar avatar

module.exports = router;
