const { BillsController } = require('../controllers');

const typeDef = `
    type Bill {
      id: ID
      description: String
      total: Float
      date: String
    }
    input BillInput {
        description: String!
        total: Float!
        date: String!
    }
    input updateBillInput {
        description: String
        total: Float
        date: String
    }
    extend type Query {
      getBills: [Bill]
    }
    extend type Mutation {
      createBill(input: BillInput): Bill
      deleteBill(id: Int): Bill
      updateBill(id: Int, input: updateBillInput): Bill
    }
`;

const resolvers = {
  Query: {
    getBills: () => {
      return BillsController.getAllBills();
    },
  },
  Mutation: {
    createBill: (_, { input }) => {
      return BillsController.saveBill(input);
    },
    deleteBill: (_, { id }) => {
      return BillsController.deleteBill(id);
    },
    updateBill: (_, { id, input }) => {
      return BillsController.updateBill(id, input);
    },
  },
};

module.exports = {
  typeDef,
  resolvers,
};
