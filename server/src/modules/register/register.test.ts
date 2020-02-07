import { request } from "graphql-request";
import { User } from "../../entity/User";
import { startServer } from "../../startServer";
import { AddressInfo } from "net";
import {
  duplicateEmail,
  emailNotLongEnough,
  passwordNotLongEnough,
  invalidEmail
} from "./errorMessages";

let getHost = "";

beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address() as AddressInfo;
  getHost = `http://127.0.0.1:${port}`;
});

const email = "test@example.com";
const password = "123456";

const mutation = (email: string, password: string) => `mutation {
    register(email: "${email}", password: "${password}") {
      path
      message
    }
}`;

describe("Register user", () => {
  it("Checks if a valid user is registered", async () => {
    const response = await request(getHost, mutation(email, password));
    expect(response).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
  });

  it("Checks duplicated email addresses", async () => {
    const response2 = await request(getHost, mutation(email, password));
    expect(response2.register).toHaveLength(1);
    expect(response2.register[0]).toEqual({
      path: "email",
      message: duplicateEmail
    });
  });

  it("Checks bad email", async () => {
    const response3: any = await request(getHost, mutation("b", password));
    expect(response3).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough
        },
        {
          path: "email",
          message: invalidEmail
        }
      ]
    });
  });

  it("Checks bad password", async () => {
    const response4: any = await request(getHost, mutation(email, "ad"));
    expect(response4).toEqual({
      register: [
        {
          path: "password",
          message: passwordNotLongEnough
        }
      ]
    });
  });

  it("Checks bad email and bad password at the same time", async () => {
    const response5: any = await request(getHost, mutation("df", "ad"));
    expect(response5).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough
        },
        {
          path: "email",
          message: invalidEmail
        },
        {
          path: "password",
          message: passwordNotLongEnough
        }
      ]
    });
  });
});

//use a test database connection
//drop all data
//
