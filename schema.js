const merge = require("lodash.merge");
const {
  departmentSchema,
  departmentResolvers,
  productSchema,
  productResolvers,
  movementSchema,
  movementResolvers,
  transferSchema,
  transferResolvers,
} = require("./schemas");

const globalTypeDefs = `
  scalar Date
  ${departmentSchema}
  ${productSchema}
  ${movementSchema}
  ${transferSchema}
`;

module.exports = {
  globalTypeDefs,
  globalResolvers: merge(
    departmentResolvers,
    productResolvers,
    movementResolvers,
    transferResolvers
  ),
};
