const express = require("express");
const {
  getStudentDashboard,
  getStudentLabs,
  getStudentStatistics,
  getStudentReports,
} = require("../controllers/studentController");
const { requireAuth, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, authorizeRoles("Student"));
router.get("/dashboard", getStudentDashboard);
router.get("/labs", getStudentLabs);
router.get("/statistics", getStudentStatistics);
router.get("/reports", getStudentReports);

module.exports = router;

