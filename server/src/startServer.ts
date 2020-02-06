import { importSchema } from "graphql-import";
import { GraphQLServer } from "graphql-yoga";
import * as path from "path";
import * as fs from "fs";
import { mergeSchemas, makeExecutableSchema } from "graphql-tools";
import { GraphQLSchema } from "graphql";

import { createTypeOrmConn } from "./utils/createTypeormConn";

export const startServer = async () => {
  const schemas: GraphQLSchema[] = [];
  const folders = fs.readdirSync(path.join(__dirname, "./modules"));

  //Async calls inside a foeEach don't await because the Promise is thrown
  for (const folder of folders) {
    const { resolvers } = require(`./modules/${folder}/resolvers`);
    const typeDefs = await importSchema(
      path.join(__dirname, `./modules/${folder}/schema.graphql`)
    );
    schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
  }

  const schema = mergeSchemas({ schemas });
  console.log(schema);
  const server = new GraphQLServer({ schema });
  await createTypeOrmConn();
  const app = await server.start({
    port: process.env.NODE_ENV === "test" ? 0 : 4000
  });
  console.log("Server is running on localhost:4000");

  return app;
};
