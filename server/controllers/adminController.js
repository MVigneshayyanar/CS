const {
  getStudents,
  getFaculty,
  getLabs,
  createStudent,
  updateStudent,
  deleteStudent,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  createLab,
  updateLab,
  deleteLab,
} = require("../services/adminService");

const getAdminOverview = async (_req, res, next) => {
  try {
    const [students, faculty, labs] = await Promise.all([getStudents(), getFaculty(), getLabs()]);

    return res.status(200).json({
      ok: true,
      message: "Admin overview fetched successfully",
      data: {
        totals: {
          students: students.length,
          faculty: faculty.length,
          labs: labs.length,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getAdminStudents = async (_req, res, next) => {
  try {
    const students = await getStudents();

    return res.status(200).json({
      ok: true,
      message: "Students fetched successfully",
      data: { students },
    });
  } catch (error) {
    return next(error);
  }
};

const getAdminFaculty = async (_req, res, next) => {
  try {
    const faculty = await getFaculty();

    return res.status(200).json({
      ok: true,
      message: "Faculty fetched successfully",
      data: { faculty },
    });
  } catch (error) {
    return next(error);
  }
};

const getAdminLabs = async (_req, res, next) => {
  try {
    const labs = await getLabs();

    return res.status(200).json({
      ok: true,
      message: "Labs fetched successfully",
      data: { labs },
    });
  } catch (error) {
    return next(error);
  }
};

const createAdminStudent = async (req, res, next) => {
  try {
    const student = await createStudent(req.body);
    return res.status(201).json({
      ok: true,
      message: "Student created successfully",
      data: { student },
    });
  } catch (error) {
    return next(error);
  }
};

const updateAdminStudent = async (req, res, next) => {
  try {
    const student = await updateStudent(req.params.id, req.body);
    return res.status(200).json({
      ok: true,
      message: "Student updated successfully",
      data: { student },
    });
  } catch (error) {
    return next(error);
  }
};

const deleteAdminStudent = async (req, res, next) => {
  try {
    await deleteStudent(req.params.id);
    return res.status(200).json({
      ok: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const createAdminFaculty = async (req, res, next) => {
  try {
    const faculty = await createFaculty(req.body);
    return res.status(201).json({
      ok: true,
      message: "Faculty created successfully",
      data: { faculty },
    });
  } catch (error) {
    return next(error);
  }
};

const updateAdminFaculty = async (req, res, next) => {
  try {
    const faculty = await updateFaculty(req.params.id, req.body);
    return res.status(200).json({
      ok: true,
      message: "Faculty updated successfully",
      data: { faculty },
    });
  } catch (error) {
    return next(error);
  }
};

const deleteAdminFaculty = async (req, res, next) => {
  try {
    await deleteFaculty(req.params.id);
    return res.status(200).json({
      ok: true,
      message: "Faculty deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const createAdminLab = async (req, res, next) => {
  try {
    const lab = await createLab(req.body);
    return res.status(201).json({
      ok: true,
      message: "Lab created successfully",
      data: { lab },
    });
  } catch (error) {
    return next(error);
  }
};

const updateAdminLab = async (req, res, next) => {
  try {
    const lab = await updateLab(req.params.id, req.body);
    return res.status(200).json({
      ok: true,
      message: "Lab updated successfully",
      data: { lab },
    });
  } catch (error) {
    return next(error);
  }
};

const deleteAdminLab = async (req, res, next) => {
  try {
    await deleteLab(req.params.id);
    return res.status(200).json({
      ok: true,
      message: "Lab deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAdminOverview,
  getAdminStudents,
  getAdminFaculty,
  getAdminLabs,
  createAdminStudent,
  updateAdminStudent,
  deleteAdminStudent,
  createAdminFaculty,
  updateAdminFaculty,
  deleteAdminFaculty,
  createAdminLab,
  updateAdminLab,
  deleteAdminLab,
};

