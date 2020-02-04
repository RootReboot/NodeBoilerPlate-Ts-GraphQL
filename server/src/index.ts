import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
import { resolvers } from "./resolvers";
import { createTypeOrmConn } from "./utils/createTypeOrmConn";

export const startServer = async () => {
  const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers
  });

  await createTypeOrmConn();
  await server.start();
  console.log("Server is running on localhost:4000");
};

startServer();
