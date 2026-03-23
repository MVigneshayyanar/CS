const {
  getSuperAdminCollegeData,
  createDepartmentHead,
  updateDepartmentHead,
  deleteDepartmentHead,
} = require("../services/godService");

const getSuperAdminCollege = async (req, res, next) => {
  try {
    const college = await getSuperAdminCollegeData(req.auth.sub);

    return res.status(200).json({
      ok: true,
      message: "College data fetched successfully",
      data: { college },
    });
  } catch (error) {
    return next(error);
  }
};

const createDepartmentHeadRecord = async (req, res, next) => {
  try {
    const result = await createDepartmentHead({
      superAdminUserId: req.auth.sub,
      payload: req.body,
    });

    return res.status(201).json({
      ok: true,
      message: "Department head created successfully",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

const updateDepartmentHeadRecord = async (req, res, next) => {
  try {
    const departmentHead = await updateDepartmentHead({
      superAdminUserId: req.auth.sub,
      departmentHeadId: req.params.id,
      payload: req.body,
    });

    return res.status(200).json({
      ok: true,
      message: "Department head updated successfully",
      data: { departmentHead },
    });
  } catch (error) {
    return next(error);
  }
};

const deleteDepartmentHeadRecord = async (req, res, next) => {
  try {
    await deleteDepartmentHead({
      superAdminUserId: req.auth.sub,
      departmentHeadId: req.params.id,
    });

    return res.status(200).json({
      ok: true,
      message: "Department head deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getSuperAdminCollege,
  createDepartmentHeadRecord,
  updateDepartmentHeadRecord,
  deleteDepartmentHeadRecord,
};

