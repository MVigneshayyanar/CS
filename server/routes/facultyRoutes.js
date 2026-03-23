const express = require("express");
const { getFacultyDashboard } = require("../controllers/facultyController");
const { requireAuth, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, authorizeRoles("Faculty"));
router.get("/dashboard", getFacultyDashboard);

module.exports = router;

