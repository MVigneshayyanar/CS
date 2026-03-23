const { getFacultyDashboardData } = require("../services/facultyService");

const getFacultyDashboard = async (req, res, next) => {
  try {
    const dashboard = await getFacultyDashboardData(req.auth.username);
    return res.status(200).json({
      ok: true,
      message: "Faculty dashboard fetched successfully",
      data: dashboard,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getFacultyDashboard,
};

