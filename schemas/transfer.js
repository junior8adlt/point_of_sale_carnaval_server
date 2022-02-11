const { TransferController } = require("../controllers");

const typeDef = `
    enum TransferType {
      STOCK
      RETURN
    }
    type Transfer {
      id: ID
      description: String
      departmentIdFrom: Int
      departmentIdTo: Int
      productId: Int
      amount: Int
      createdAt: String
      updatedAt: String
      deletedAt: String
    }
    type TransferJoin {
      id: ID
      description: String
      departmentFrom: Department
      departmentTo: Department
      product: Product
      amount: Int
      createdAt: Date
      updatedAt: Date
      deletedAt: Date
    }
    input TransferInput {
      description: String
      departmentIdFrom: Int!
      departmentIdTo: Int!
      productId: Int!
      amount: Int!
    }
    input updateTransferInput {
      description: String
      departmentIdFrom: Int
      departmentIdTo: Int
      productId: Int
      amount: Int
    }
    input GetTransfersByDepartmentInput {
      id: Int!
      type: TransferType!
      date: String
    }
    extend type Query {
      getTransfersByDepartment(input: GetTransfersByDepartmentInput): [TransferJoin]
      getTransfers: [TransferJoin]
    }
    extend type Mutation {
      createTransfers(input: [TransferInput]): Boolean
      deleteTransfer(id: Int!): Transfer
      updateTransfer(id: Int!, input: updateTransferInput): Transfer
    }
`;

const resolvers = {
  Query: {
    getTransfersByDepartment: (_, { input }) => {
      const { id, type, date } = input;
      return TransferController.getByDepartment(id, type, date);
    },
    getTransfers: () => {
      return TransferController.getAll();
    },
  },
  Mutation: {
    createTransfers: (_, { input }) => {
      return TransferController.saveTransfers(input);
    },
    deleteTransfer: (_, { id }) => {
      return TransferController.deleteTransfer(id);
    },
    updateTransfer: (_, { id, input }) => {
      return TransferController.updateTransfer(id, input);
    },
  },
};

module.exports = {
  typeDef,
  resolvers,
};
