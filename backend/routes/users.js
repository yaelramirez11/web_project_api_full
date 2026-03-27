const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require("../controllers/users");

// GET /users
router.get("/", getUsers);

router.get("/me", getCurrentUser);

// GET /users/:userId
router.get("/:userId", getUserById);

// NUEVAS rutas para actualizar perfil y avatar
router.patch("/me", updateProfile); // Actualizar perfil
router.patch("/me/avatar", updateAvatar); // Actualizar avatar

module.exports = router;
