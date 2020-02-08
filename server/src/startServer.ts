import { importSchema } from "graphql-import";
import { GraphQLServer } from "graphql-yoga";
import * as path from "path";
import * as fs from "fs";
import { mergeSchemas, makeExecutableSchema } from "graphql-tools";
import { GraphQLSchema } from "graphql";

import * as Redis from "ioredis";

import { createTypeOrmConn } from "./utils/createTypeormConn";
import { User } from "./entity/User";

export const startServer = async () => {
  const redis = new Redis();
  const server = await createGraphQLServer(redis);

  server.express.get("/confirm/:id", async (req, res) => {
    const { id } = req.params;
    const userId = await redis.get(id);
    if (userId) {
      await User.update({ id: userId }, { confirmed: true });
      await redis.del(id);
      res.send("ok");
    } else {
      res.send("invalid");
    }
  });

  await createTypeOrmConn();
  const app = await server.start({
    port: process.env.NODE_ENV === "test" ? 0 : 4000
  });
  console.log("Server is running on localhost:4000");

  return app;
};

const getSchemas = async () => {
  const schemas: GraphQLSchema[] = [];
  const folders = fs.readdirSync(path.join(__dirname, "./modules"));

  //Async calls inside a forEach don't await because the Promise is thrown
  for (const folder of folders) {
    const { resolvers } = require(`./modules/${folder}/resolvers`);
    const typeDefs = await importSchema(
      path.join(__dirname, `./modules/${folder}/schema.graphql`)
    );
    schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
  }
  return schemas;
};

const createGraphQLServer = async (redis: Redis.Redis) => {
  return new GraphQLServer({
    schema: mergeSchemas({ schemas: await getSchemas() }),
    context: ({ request }) => ({
      redis,
      url: request.protocol + "://" + request.get("host")
    })
  });
};
