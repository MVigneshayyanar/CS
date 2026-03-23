const express = require("express");
const {
	loginByPortal,
	loginByType,
	getCurrentSession,
	getGodProtectedData,
	changeStudentPassword,
	changePassword,
} = require("../controllers/authController");
const { requireAuth, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginByPortal);

router.post("/login/god", loginByType("God"));
router.post("/login/super-admin", loginByType("SuperAdmin"));
router.post("/login/admin", loginByType("Admin"));
router.post("/login/faculty", loginByType("Faculty"));
router.post("/login/student", loginByType("Student"));

router.get("/me", requireAuth, getCurrentSession);
router.get("/god/protected", requireAuth, authorizeRoles("God"), getGodProtectedData);
router.put("/password/change", requireAuth, changePassword);
router.put("/password/change/student", requireAuth, authorizeRoles("Student"), changeStudentPassword);

module.exports = router;
