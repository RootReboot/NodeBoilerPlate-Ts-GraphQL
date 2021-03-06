import * as Redis from "ioredis";
import fetch from "node-fetch";

import { createConfirmEmailLink } from "./createConfirmEmailLink";
import { createTypeOrmConn } from "../createTypeOrmConn";
import { User } from "../../entity/User";

let userId = "";
const redis = new Redis();

beforeAll(async () => {
  await createTypeOrmConn();
  const user = await User.create({
    email: "bobbob@bob.com",
    password: "123456"
  }).save();
  userId = user.id;
});

describe("Test utils/createConfirmEmailLink", () => {
  test("Make sure it confirms user and clears key in redis", async () => {
    const url = await createConfirmEmailLink(
      process.env.TEST_HOST as string,
      userId,
      redis
    );

    const response = await fetch(url);
    const text = await response.text();
    expect(text).toEqual("ok");
    const user = await User.findOne({ where: { id: userId } });
    expect((user as User).confirmed).toBeTruthy();
    const chunks = url.split("/");
    const key = chunks[chunks.length - 1];
    const value = await redis.get(key);
    expect(value).toBeNull();
  });
});
