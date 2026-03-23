const express = require("express");
const { getStudentDashboard } = require("../controllers/studentController");
const { requireAuth, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, authorizeRoles("Student"));
router.get("/dashboard", getStudentDashboard);

module.exports = router;

