const {
  typeDef: productSchema,
  resolvers: productResolvers,
} = require("./product");
const {
  typeDef: departmentSchema,
  resolvers: departmentResolvers,
} = require("./department");
const {
  typeDef: movementSchema,
  resolvers: movementResolvers,
} = require("./movement");

const {
  typeDef: transferSchema,
  resolvers: transferResolvers,
} = require("./transfer");

module.exports = {
  productSchema,
  productResolvers,
  departmentSchema,
  departmentResolvers,
  movementSchema,
  movementResolvers,
  transferSchema,
  transferResolvers,
};
