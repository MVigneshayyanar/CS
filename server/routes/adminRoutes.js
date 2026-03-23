const express = require("express");
const {
  getAdminOverview,
  getAdminStudents,
  getAdminFaculty,
  getAdminLabs,
  createAdminStudent,
  updateAdminStudent,
  deleteAdminStudent,
  createAdminFaculty,
  updateAdminFaculty,
  deleteAdminFaculty,
  createAdminLab,
  updateAdminLab,
  deleteAdminLab,
} = require("../controllers/adminController");
const { requireAuth, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, authorizeRoles("Admin"));

router.get("/overview", getAdminOverview);
router.get("/students", getAdminStudents);
router.get("/faculty", getAdminFaculty);
router.get("/labs", getAdminLabs);
router.post("/students", createAdminStudent);
router.put("/students/:id", updateAdminStudent);
router.delete("/students/:id", deleteAdminStudent);
router.post("/faculty", createAdminFaculty);
router.put("/faculty/:id", updateAdminFaculty);
router.delete("/faculty/:id", deleteAdminFaculty);
router.post("/labs", createAdminLab);
router.put("/labs/:id", updateAdminLab);
router.delete("/labs/:id", deleteAdminLab);

module.exports = router;

