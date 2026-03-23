const express = require("express");
const {
  getColleges,
  createCollegeRecord,
  createSuperAdminRecord,
} = require("../controllers/godController");
const { requireAuth, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, authorizeRoles("God"));

router.get("/colleges", getColleges);
router.post("/colleges", createCollegeRecord);
router.post("/super-admins", createSuperAdminRecord);

module.exports = router;

