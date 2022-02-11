const { DepartmentController } = require("../controllers");

const typeDef = `
    type Department {
      id: ID
      name: String
      location: String
      responsable: String
      type: String
      createdAt: Date
      updatedAt: Date
      deletedAt: Date
    }
    input DepartmentInput {
      name: String!
      location: String!
      responsable: String!
      type: String!
    }
    input updateDepartmentInput {
      name: String
      location: String
      responsable: String
    }
    type Query {
      getDepartments(type: String): [Department]
    }
    type Mutation {
      createDepartment(input: DepartmentInput): Department
      deleteDepartment(id: Int): Department
      updateDepartment(id: Int, input: updateDepartmentInput): Department
    }
`;

const resolvers = {
  Query: {
    getDepartments: (_, { type }, context) => {
      if (type) {
        return DepartmentController.getByType(type);
      }
      return DepartmentController.getAll();
    },
  },
  Mutation: {
    createDepartment: (_, { input }, context) => {
      return DepartmentController.saveDepartment(input);
    },
    deleteDepartment: (_, { id }) => {
      return DepartmentController.deleteDepartment(id);
    },
    updateDepartment: (_, { id, input }) => {
      return DepartmentController.updateDepartment(id, input);
    },
  },
};

module.exports = {
  typeDef,
  resolvers,
};
