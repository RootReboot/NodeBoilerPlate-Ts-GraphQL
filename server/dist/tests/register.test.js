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
const graphql_request_1 = require("graphql-request");
const User_1 = require("../entity/User");
const startServer_1 = require("../startServer");
let getHost = "";
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    const app = yield startServer_1.startServer();
    const { port } = app.address();
    getHost = `http://127.0.0.1:${port}`;
}));
const email = "test@example.com";
const password = "123";
const mutation = `mutation {
    register(email: "${email}", password: "${password}")
}`;
test("Register user", () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield graphql_request_1.request(getHost, mutation);
    expect(response).toEqual({ register: true });
    const users = yield User_1.User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
}));
//# sourceMappingURL=register.test.js.map