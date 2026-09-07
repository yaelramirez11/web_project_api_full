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

const {
  validateUserId,
  validateUserUpdate,
  validateAvatar,
} = require("../middlewares/validators");

// GET /users
router.get("/", auth, getUsers);

// GET /users/me
router.get("/me", auth, getCurrentUser);

// GET /users/:userId
router.get("/:userId", auth, validateUserId, getUserById);

// PATCH avatar
router.patch("/me/avatar", auth, validateAvatar, updateAvatar);

//PATCH /users/me
router.patch("/me", auth, validateUserUpdate, updateProfile);

module.exports = router;