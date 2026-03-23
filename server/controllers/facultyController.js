const { getFacultyDashboardData, getFacultyLabsData } = require("../services/facultyService");

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

const getFacultyLabs = async (req, res, next) => {
  try {
    const labsData = await getFacultyLabsData(req.auth.username);
    return res.status(200).json({
      ok: true,
      message: "Faculty labs fetched successfully",
      data: labsData,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getFacultyDashboard,
  getFacultyLabs,
};

