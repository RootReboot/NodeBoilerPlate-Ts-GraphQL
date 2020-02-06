import { GraphQLServer } from "graphql-yoga";
import { resolvers } from "./resolvers";
import { createTypeOrmConn } from "./utils/createTypeOrmConn";

export const startServer = async () => {
  const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers
  });

  await createTypeOrmConn();
  const app = await server.start({
    port: process.env.NODE_ENV === "test" ? 0 : 4000
  });
  console.log("Server is running on localhost:4000");

  return app;
};
