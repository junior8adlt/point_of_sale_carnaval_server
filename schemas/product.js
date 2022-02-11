const { ProductController } = require("../controllers");

const typeDef = `
    type Product {
      id: ID
      name: String
      price: Float
      comission: Int
    }
    input ProductInput {
      name: String!
      price: Float!
      comission: Int!
    }
    input updateProductInput {
      name: String
      price: Float
      comission: Int
    }
    extend type Query {
      getProducts(type: String): [Product]
    }
    extend type Mutation {
      createProduct(input: ProductInput): Product
      deleteProduct(id: Int): Product
      updateProduct(id: Int, input: updateProductInput): Product
    }
`;

const resolvers = {
  Query: {
    getProducts: () => {
      return ProductController.getAll();
    },
  },
  Mutation: {
    createProduct: (_, { input }) => {
      return ProductController.saveProduct(input);
    },
    deleteProduct: (_, { id }) => {
      return ProductController.deleteProduct(id);
    },
    updateProduct: (_, { id, input }) => {
      return ProductController.updateProduct(id, input);
    },
  },
};

module.exports = {
  typeDef,
  resolvers,
};
