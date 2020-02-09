import { importSchema } from "graphql-import";
import * as path from "path";
import * as fs from "fs";
import { mergeSchemas, makeExecutableSchema } from "graphql-tools";
import { GraphQLSchema } from "graphql";

export const genSchema = async () => {
  const schemas: GraphQLSchema[] = [];
  const folders = fs.readdirSync(path.join(__dirname, "../modules"));

  //Async calls inside a forEach don't await because the Promise is thrown
  for (const folder of folders) {
    const { resolvers } = require(`../modules/${folder}/resolvers`);
    const typeDefs = await importSchema(
      path.join(__dirname, `../modules/${folder}/schema.graphql`)
    );
    schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
  }
  return mergeSchemas({ schemas });
};
