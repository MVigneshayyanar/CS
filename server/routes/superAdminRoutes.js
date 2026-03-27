const express = require("express");
const {
  getSuperAdminCollege,
  createDepartmentHeadRecord,
  updateDepartmentHeadRecord,
  deleteDepartmentHeadRecord,
} = require("../controllers/superAdminController");
const { requireAuth, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, authorizeRoles("SuperAdmin"));

router.get("/college", getSuperAdminCollege);
router.post("/department-heads", createDepartmentHeadRecord);
router.put("/department-heads/:id", updateDepartmentHeadRecord);
router.delete("/department-heads/:id", deleteDepartmentHeadRecord);

module.exports = router;

