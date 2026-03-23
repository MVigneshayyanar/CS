const {
  getAllowedRolesByPortal,
  getAllowedRolesByLoginType,
  loginWithRoles,
  changePasswordForUser,
} = require("../services/authService");

const performLogin = async ({ identifier, password, allowedRoles, successMessage }) => {
  const result = await loginWithRoles({
    identifier,
    password,
    allowedRoles,
  });

  return {
    ok: true,
    message: successMessage,
    data: result,
  };
};

const loginByPortal = async (req, res, next) => {
  try {
    const { identifier, password, portal } = req.body;
    const allowedRoles = getAllowedRolesByPortal(portal);

    if (!allowedRoles.length) {
      const error = new Error("Invalid portal type");
      error.statusCode = 400;
      throw error;
    }

    const response = await performLogin({
      identifier,
      password,
      allowedRoles,
      successMessage: `${portal} login successful`,
    });

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const loginByType = (loginType) => async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    const allowedRoles = getAllowedRolesByLoginType(loginType);

    if (!allowedRoles.length) {
      const error = new Error("Invalid login type");
      error.statusCode = 400;
      throw error;
    }

    const response = await performLogin({
      identifier,
      password,
      allowedRoles,
      successMessage: `${loginType} login successful`,
    });

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const getCurrentSession = (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Session fetched successfully",
    data: {
      user: {
        id: req.auth.sub,
        username: req.auth.username,
        role: req.auth.role,
      },
    },
  });
};

const getGodProtectedData = (req, res) => {
  res.status(200).json({
    ok: true,
    message: "God protected endpoint access granted",
    data: {
      role: req.auth.role,
      username: req.auth.username,
    },
  });
};

const changeStudentPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const result = await changePasswordForUser({
      userId: req.auth?.sub,
      currentPassword,
      newPassword,
      allowedRoles: ["Student"],
    });

    return res.status(200).json({
      ok: true,
      message: "Password updated successfully",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const result = await changePasswordForUser({
      userId: req.auth?.sub,
      currentPassword,
      newPassword,
      allowedRoles: ["Student", "Faculty", "Admin", "SuperAdmin", "God"],
    });

    return res.status(200).json({
      ok: true,
      message: "Password updated successfully",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  loginByPortal,
  loginByType,
  getCurrentSession,
  getGodProtectedData,
  changeStudentPassword,
  changePassword,
};
