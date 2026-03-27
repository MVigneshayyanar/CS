const {
  getCollegesWithSuperAdmins,
  createCollege,
  createSuperAdmin,
  createGodAccount,
  listGodAccounts,
  deleteGodAccount,
} = require("../services/godService");

const getColleges = async (_req, res, next) => {
  try {
    const colleges = await getCollegesWithSuperAdmins();

    return res.status(200).json({
      ok: true,
      message: "Colleges fetched successfully",
      data: { colleges },
    });
  } catch (error) {
    return next(error);
  }
};

const getSuperAdminCollege = async (req, res, next) => {
  try {
    // SuperAdmin (Principal) can view their college data with department heads and admins
    const colleges = await getCollegesWithSuperAdmins();

    // Return first college (in future, filter by SuperAdmin's assigned college from req.auth)
    const college = colleges[0] || null;

    if (!college) {
      return res.status(404).json({
        ok: false,
        message: "College not found",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "College data fetched successfully",
      data: { college },
    });
  } catch (error) {
    return next(error);
  }
};

const createCollegeRecord = async (req, res, next) => {
  try {
    const college = await createCollege(req.body);

    return res.status(201).json({
      ok: true,
      message: "College created successfully",
      data: { college },
    });
  } catch (error) {
    return next(error);
  }
};

const createSuperAdminRecord = async (req, res, next) => {
  try {
    const result = await createSuperAdmin(req.body);

    return res.status(201).json({
      ok: true,
      message: "Super admin created successfully",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

const createGodRecord = async (req, res, next) => {
  try {
    const result = await createGodAccount(req.body);

    return res.status(201).json({
      ok: true,
      message: "God account created successfully",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

const listGodRecords = async (_req, res, next) => {
  try {
    const users = await listGodAccounts();

    return res.status(200).json({
      ok: true,
      message: "God accounts fetched successfully",
      data: { users },
    });
  } catch (error) {
    return next(error);
  }
};

const deleteGodRecord = async (req, res, next) => {
  try {
    const result = await deleteGodAccount({
      godUserId: req.params.userId,
      currentUserId: req.auth?.sub,
    });

    return res.status(200).json({
      ok: true,
      message: "God account deleted successfully",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getColleges,
  getSuperAdminCollege,
  createCollegeRecord,
  createSuperAdminRecord,
  createGodRecord,
  listGodRecords,
  deleteGodRecord,
};

