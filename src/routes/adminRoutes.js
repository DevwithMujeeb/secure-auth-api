const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  getDashboard,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Admin + Moderator
router.get(
  "/dashboard",
  protect,
  authorize("admin", "moderator"),
  getDashboard,
);

// Admin only
router.get("/users", protect, authorize("admin"), getAllUsers);
router.patch("/users/:id/role", protect, authorize("admin"), updateUserRole);

module.exports = router;
