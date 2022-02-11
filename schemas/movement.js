const { MovementController } = require("../controllers");

const typeDef = `
    type Movement {
      id: ID
      description: String
      amount: String
      total: String
      type: String
      departmentId: Int
      productId: Int
      createdAt: String
      updatedAt: String
      deletedAt: String
    }
    type MovementJoin {
      id: ID
      description: String
      amount: String
      total: String
      type: String
      department: Department
      product: Product
      createdAt: Date
      updatedAt: Date
      deletedAt: Date
    }
    input MovementInput {
      description: String
      productId: Int!
      amount: Int!
      total: Int!
      type: String!
      departmentId: Int!
    }
    input updateMovementInput {
      description: String
      productId: Int
      amount: Int
      total: Int
      type: String
      departmentId: Int
    }
    type Metrics {
        totalSale: Float
        totalSaleCommission: Float
        totalFreeSale: Float
        totalAmountSaleProduct: Float
        totalAmountPurchaseProduct: Float
        totalFreeAmountSaleProduct: Float
        totalAmountProductTransfered: Float
        totalOriginalProductPrice: Float
    }
    type MovementsResume {
      metrics: Metrics
      movements: [MovementJoin]
      transfers: [TransferJoin]
    }
    extend type Query {
      getMovementsByDepartment(id: Int): [MovementJoin]
      getMovementsByDepartmentAndType(departmentId: Int!, departmentType: String!): [MovementJoin]
      getResumeByDepartmentAndDate(departmentId: Int!, date: String!): MovementsResume
    }
    extend type Mutation {
      createMovements(input: [MovementInput]): Boolean
      deleteMovement(id: Int): Movement
      updateMovement(id: Int, input: updateMovementInput): Movement
    }
`;

const resolvers = {
  Query: {
    getMovementsByDepartment: (_, { id }, context) => {
      if (id) {
        return MovementController.getByDepartment(id);
      }
      return MovementController.getAll();
    },
    getMovementsByDepartmentAndType: (
      _,
      { departmentId, departmentType },
      context
    ) => {
      return MovementController.getByDepartmentAndType(
        departmentId,
        departmentType
      );
    },
    getResumeByDepartmentAndDate: (_, { departmentId, date }, context) => {
      return MovementController.getResumeByDepartmentAndDate(
        departmentId,
        date
      );
    },
  },
  Mutation: {
    createMovements: (_, { input }, context) => {
      return MovementController.saveMovements(input);
    },
    deleteMovement: (_, { id }) => {
      return MovementController.deleteMovement(id);
    },
    updateMovement: (_, { id, input }) => {
      return MovementController.updateMovement(id, input);
    },
  },
};

module.exports = {
  typeDef,
  resolvers,
};
