const express = require("express");
const healthRoutes = require("./healthRoutes");
const authRoutes = require("./authRoutes");
const godRoutes = require("./godRoutes");
const superAdminRoutes = require("./superAdminRoutes");
const adminRoutes = require("./adminRoutes");
const studentRoutes = require("./studentRoutes");
const facultyRoutes = require("./facultyRoutes");

const router = express.Router();

router.use(healthRoutes);
router.use("/auth", authRoutes);
router.use("/god", godRoutes);
router.use("/super-admin", superAdminRoutes);
router.use("/admin", adminRoutes);
router.use("/student", studentRoutes);
router.use("/faculty", facultyRoutes);

module.exports = router;
