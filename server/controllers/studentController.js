const {
  getStudentDashboardData,
  getStudentLabsData,
  getStudentStatisticsData,
  getStudentReportsData,
  updateStudentExperimentProgress,
} = require("../services/studentService");

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

const getStudentLabs = async (req, res, next) => {
  try {
    const labs = await getStudentLabsData(req.auth.username);
    return res.status(200).json({
      ok: true,
      message: "Student labs fetched successfully",
      data: { labs },
    });
  } catch (error) {
    return next(error);
  }
};

const getStudentStatistics = async (req, res, next) => {
  try {
    const statistics = await getStudentStatisticsData(req.auth.username);
    return res.status(200).json({
      ok: true,
      message: "Student statistics fetched successfully",
      data: statistics,
    });
  } catch (error) {
    return next(error);
  }
};

const getStudentReports = async (req, res, next) => {
  try {
    const reports = await getStudentReportsData(req.auth.username);
    return res.status(200).json({
      ok: true,
      message: "Student reports fetched successfully",
      data: reports,
    });
  } catch (error) {
    return next(error);
  }
};

const updateExperimentStatus = async (req, res, next) => {
  try {
    const { labId, experimentIndex, status, progress } = req.body;
    const result = await updateStudentExperimentProgress(
      req.auth.username,
      labId,
      experimentIndex,
      status,
      progress
    );
    return res.status(200).json({
      ok: true,
      message: "Experiment status updated successfully",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getStudentDashboard,
  getStudentLabs,
  getStudentStatistics,
  getStudentReports,
  updateExperimentStatus,
};

