const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const express = require("express");
const http = require("http");
const cors = require("cors");

const expressRoutes = require('./routes');
const env = require("./config/env");

const { globalTypeDefs, globalResolvers } = require("./schema");

async function startApolloServer(typeDefs, resolvers) {
  try {
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
      context: async ({ req }) => {
        try {
          // context middleware
          return { user: null };
        } catch (error) {
          return { user: null };
        }
      },
    });
    await server.start();
    // This middleware should be added before calling `applyMiddleware`.
    app.use(cors());
    app.use('/api', expressRoutes)
    server.applyMiddleware({ app });
    const { NODE_ENV, HOST, PORT } = env;
    await new Promise((resolve) =>
      httpServer.listen({ port: PORT, host: HOST }, resolve)
    );
    console.log(
      `🚀 Graphql server ready at http://${HOST}:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Express server ready at http://${HOST}:${PORT}/api`
    );
  } catch (error) {
    console.error({ error });
  }
}

startApolloServer(globalTypeDefs, globalResolvers);
