const { toApolloError } = require("apollo-server-express");

const notFound = () => toApolloError(new Error("Not found"), "NOT_FOUND");
const emailError = () =>
  toApolloError(new Error("Can not send email"), "EMAIL_ERROR");

const invalidComment = () =>
  toApolloError(new Error("Invalid comment"), "INVALID_COMMENT");

module.exports = { notFound, emailError, invalidComment };
