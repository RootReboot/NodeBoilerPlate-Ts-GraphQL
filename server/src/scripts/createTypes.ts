import { generateNamespace } from "@gql2ts/from-schema";
import * as fs from "fs";
import * as path from "path";

import { genSchema } from "../utils/genSchema";

const createTypes = async () => {
  const schemas = await genSchema();

  const typescriptTypes = generateNamespace("GQL", schemas);

  fs.writeFile(
    path.join(__dirname, "../types/schema.d.ts"),
    typescriptTypes,
    err => {
      console.log("Hello, TypeScript");
      console.log(err);
      console.log("Hello World");
    }
  );
};

createTypes();
