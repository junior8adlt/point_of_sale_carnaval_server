const { MovementController } = require('../controllers');

const typeDef = `
    type Movement {
      id: ID
      description: String
      amount: String
      total: String
      type: String
      saleType: String
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
      saleType: String
      department: Department
      product: Product
      date: String
      createdAt: Date
      updatedAt: Date
      deletedAt: Date
      totalSaleAtFactoryCost: Float
    }
    input MovementInput {
      description: String
      productId: Int!
      amount: Int!
      total: Int!
      type: String!
      departmentId: Int!
      date: String!
      saleType: String
    }
    input updateMovementInput {
      description: String
      productId: Int
      amount: Int
      total: Int
      type: String
      departmentId: Int
      date: String
      saleType: String
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
        wareHouseTotalFinal: Float
        totalProductAmountToReturn: Float
        totalSaleAtFactoryCost: Float
    }
    type TransferData {
      send: [TransferJoin]
      returned: [TransferJoin]
    }
    type MovementsResume {
      metrics: Metrics
      movements: [MovementJoin]
      transfers: TransferData
    }
    extend type Query {
      getMovementsByDepartment(id: Int): [MovementJoin]
      getMovementsByDepartmentAndType(departmentId: Int!, departmentType: String!, date: String): [MovementJoin]
      getResumeByDepartmentAndDate(departmentId: Int!, date: String!): MovementsResume
      getSalesTotalByAllTheShops(date: String): [MovementJoin]
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
    getMovementsByDepartmentAndType: (_, { departmentId, departmentType, date }, context) => {
      return MovementController.getByDepartmentAndType(departmentId, departmentType, date);
    },
    getSalesTotalByAllTheShops: (_, { date }, context) => {
      return MovementController.getSalesTotalByAllTheShops(date);
    },
    getResumeByDepartmentAndDate: (_, { departmentId, date }, context) => {
      return MovementController.getResumeByDepartmentAndDate(departmentId, date);
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
