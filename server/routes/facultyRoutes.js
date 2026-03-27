const express = require("express");
const { getFacultyDashboard, getFacultyLabs, updateExperimentDeadline, getFacultyProfile } = require("../controllers/facultyController");
const { requireAuth, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, authorizeRoles("Faculty"));
router.get("/dashboard", getFacultyDashboard);
router.get("/labs", getFacultyLabs);
router.get("/profile", getFacultyProfile);
router.put("/experiment-deadline", updateExperimentDeadline);

module.exports = router;

