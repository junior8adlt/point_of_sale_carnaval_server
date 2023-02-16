const merge = require('lodash.merge');
const {
  departmentSchema,
  departmentResolvers,
  productSchema,
  productResolvers,
  movementSchema,
  movementResolvers,
  transferSchema,
  transferResolvers,
  billSchema,
  billResolvers,
} = require('./schemas');

const globalTypeDefs = `
  scalar Date
  ${departmentSchema}
  ${productSchema}
  ${movementSchema}
  ${transferSchema}
  ${billSchema}

`;

module.exports = {
  globalTypeDefs,
  globalResolvers: merge(
    departmentResolvers,
    productResolvers,
    movementResolvers,
    transferResolvers,
    billResolvers,
  ),
};
