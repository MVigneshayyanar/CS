const { getStudentDashboardData } = require("../services/studentService");

const getStudentDashboard = async (req, res, next) => {
  try {
    const dashboard = await getStudentDashboardData(req.auth.username);
    return res.status(200).json({
      ok: true,
      message: "Student dashboard fetched successfully",
      data: dashboard,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getStudentDashboard,
};

