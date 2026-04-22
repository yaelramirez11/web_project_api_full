const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require("../controllers/users");

// GET /users
router.get("/", auth, getUsers);

router.get("/me", auth, getCurrentUser);

// GET /users/:userId
router.get("/:userId", auth, getUserById);

// NUEVAS rutas para actualizar perfil y avatar
router.patch("/me", auth, updateProfile); // Actualizar perfil
router.patch("/me/avatar", auth, updateAvatar); // Actualizar avatar

module.exports = router;
