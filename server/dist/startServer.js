"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_import_1 = require("graphql-import");
const graphql_yoga_1 = require("graphql-yoga");
const path = require("path");
const fs = require("fs");
const graphql_tools_1 = require("graphql-tools");
const createTypeormConn_1 = require("./utils/createTypeormConn");
exports.startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const schemas = [];
    const folders = fs.readdirSync(path.join(__dirname, "./modules"));
    folders.forEach((folder) => __awaiter(void 0, void 0, void 0, function* () {
        const { resolvers } = require(`./modules/${folder}/resolvers`);
        const typeDefs = yield graphql_import_1.importSchema(path.join(__dirname, `./modules/${folder}/schema.graphql`));
        schemas.push(graphql_tools_1.makeExecutableSchema({ resolvers, typeDefs }));
    }));
    const server = new graphql_yoga_1.GraphQLServer({ schema: graphql_tools_1.mergeSchemas({ schemas }) });
    yield createTypeormConn_1.createTypeOrmConn();
    const app = yield server.start({
        port: process.env.NODE_ENV === "test" ? 0 : 4000
    });
    console.log("Server is running on localhost:4000");
    return app;
});
//# sourceMappingURL=startServer.js.map