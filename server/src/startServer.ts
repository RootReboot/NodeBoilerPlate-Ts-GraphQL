import { GraphQLServer } from "graphql-yoga";

import * as Redis from "ioredis";
import { redis } from "./redis";
import { createTypeOrmConn } from "./utils/createTypeormConn";
import { confirmEmail } from "./controllers/confirmEmail/confirmEmail";
import { genSchema } from "./utils/genSchema";

export const startServer = async () => {
  const server = await createGraphQLServer(redis);

  server.express.get("/confirm/:id", confirmEmail);

  await createTypeOrmConn();
  const app = await server.start({
    port: process.env.NODE_ENV === "test" ? 0 : 4000
  });
  console.log("Server is running on localhost:4000");

  return app;
};

const createGraphQLServer = async (redis: Redis.Redis) => {
  return new GraphQLServer({
    schema: await genSchema(),
    context: ({ request }) => ({
      redis,
      url: request.protocol + "://" + request.get("host")
    })
  });
};
