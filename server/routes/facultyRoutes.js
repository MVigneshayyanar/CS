const express = require("express");
const { getFacultyDashboard, getFacultyLabs } = require("../controllers/facultyController");
const { requireAuth, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, authorizeRoles("Faculty"));
router.get("/dashboard", getFacultyDashboard);
router.get("/labs", getFacultyLabs);

module.exports = router;

