const User = require("../models/User");
const logger = require("../utils/logger");

// @GET /api/admin/users - Admin only
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-refreshToken -passwordResetToken");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    logger.error(`GetAllUsers error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @PATCH /api/admin/users/:id/role - Admin only
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ["user", "admin", "moderator"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true },
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    logger.info(
      `User ${user.email} role updated to ${role} by admin ${req.user.id}`,
    );

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error(`UpdateUserRole error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @GET /api/admin/dashboard - Admin and Moderator
const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const admins = await User.countDocuments({ role: "admin" });
    const moderators = await User.countDocuments({ role: "moderator" });
    const regularUsers = await User.countDocuments({ role: "user" });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        breakdown: { admins, moderators, regularUsers },
        accessedBy: { id: req.user.id, role: req.user.role },
      },
    });
  } catch (error) {
    logger.error(`Dashboard error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getAllUsers, updateUserRole, getDashboard };
