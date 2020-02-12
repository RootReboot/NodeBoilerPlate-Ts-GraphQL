import { request } from "graphql-request";
import { invalidLogin, confirmEmailError } from "./errorMessages";
import { User } from "../../entity/User";
import { createTypeOrmConn } from "../../utils/createTypeOrmConn";
import { Connection } from "typeorm";

const email = "tom@bob.com";
const password = "jalksdf";

const registerMutation = (email: string, password: string) => `
mutation {
  register(email: "${email}", password: "${password}") {
    path
    message
  }
}
`;

const loginMutation = (email: string, password: string) => `
mutation {
  login(email: "${email}", password: "${password}") {
    path
    message
  }
}
`;

beforeAll(async () => {
  await createTypeOrmConn();
});
let conn: Connection;
beforeAll(async () => {
  conn = await createTypeOrmConn();
});
afterAll(async () => {
  conn.close();
});

const loginExpectError = async (
  email: string,
  password: string,
  errMsg: string
) => {
  const response = await request(
    process.env.TEST_HOST as string,
    loginMutation(email, password)
  );

  expect(response).toEqual({
    login: [
      {
        path: "email",
        message: errMsg
      }
    ]
  });
};

describe("login", () => {
  test("email not found send back error", async () => {
    await loginExpectError("bob@bob.com", "whatever", invalidLogin);
  });

  test("email not confirmed", async () => {
    await request(
      process.env.TEST_HOST as string,
      registerMutation(email, password)
    );

    await loginExpectError(email, password, confirmEmailError);

    await User.update({ email }, { confirmed: true });

    await loginExpectError(email, "aslkdfjaksdljf", invalidLogin);

    const response = await request(
      process.env.TEST_HOST as string,
      loginMutation(email, password)
    );

    expect(response).toEqual({ login: null });
  });
});
