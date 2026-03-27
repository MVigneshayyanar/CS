const express = require("express");
const {
  getColleges,
  createCollegeRecord,
  createSuperAdminRecord,
  createGodRecord,
  listGodRecords,
  deleteGodRecord,
} = require("../controllers/godController");
const { requireAuth, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, authorizeRoles("God"));

router.get("/colleges", getColleges);
router.post("/colleges", createCollegeRecord);
router.post("/super-admins", createSuperAdminRecord);
router.post("/users", createGodRecord);
router.get("/users", listGodRecords);
router.delete("/users/:userId", deleteGodRecord);

module.exports = router;

