const { getFacultyDashboardData, getFacultyLabsData, updateLabExperimentDeadline, getFacultyProfile: getFacultyProfileData } = require("../services/facultyService");

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

const updateExperimentDeadline = async (req, res, next) => {
  try {
    const { labId, experimentIndex, deadline } = req.body;
    const result = await updateLabExperimentDeadline(labId, experimentIndex, deadline, req.auth.username);
    return res.status(200).json({
      ok: true,
      message: "Experiment deadline updated successfully",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

const getFacultyProfile = async (req, res, next) => {
  try {
    const profile = await getFacultyProfileData(req.auth.username);
    return res.status(200).json({
      ok: true,
      data: profile,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getFacultyDashboard,
  getFacultyLabs,
  updateExperimentDeadline,
  getFacultyProfile,
};

