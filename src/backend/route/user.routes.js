const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUser,
  getOneUser,
  updateUser,
  deleteUser,
} = require("../controllers/UserController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/", getAllUser);
router.get("/:id", protect, getOneUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
