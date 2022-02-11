const { AuthenticationError } = require("apollo-server-express");
const { ROLES } = require("../constants/user");

const validateAuth = (context) => {
  if (!context.user) {
    throw new AuthenticationError("Invalid token");
  }
  return;
};

const validateAuthAdmin = (context) => {
  const [ADMIN] = ROLES;
  if (!context.user || context.user.role !== ADMIN) {
    throw new AuthenticationError("Invalid token");
  }
  return;
};

module.exports = { validateAuth, validateAuthAdmin };
