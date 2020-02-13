import { GraphQLServer } from "graphql-yoga";
import "reflect-metadata";
import * as dotenv from "dotenv";
import * as Redis from "ioredis";
import { redis } from "./redis";
import { createTypeOrmConn } from "./utils/createTypeormConn";
import { confirmEmail } from "./controllers/confirmEmail/confirmEmail";
import { genSchema } from "./utils/genSchema";
import * as session from "express-session";
import * as connectRedis from "connect-redis";

dotenv.config({ path: "./src/.env" });

const RedisStore = connectRedis(session);

export const startServer = async () => {
  const server = await createGraphQLServer(redis);

  server.express.use(
    session({
      store: new RedisStore({
        client: redis as any
      }),
      name: "qid",
      secret: process.env.SESSION_SECRET_KEY as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
    })
  );

  const cors = {
    credentials: true,
    origin: process.env.NODE_ENV === "test" ? "*" : process.env.FRONTEND_HOST
  };

  server.express.get("/confirm/:id", confirmEmail);

  await createTypeOrmConn();
  const app = await server.start({
    cors,
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
      url: request.protocol + "://" + request.get("host"),
      session: request.session
    })
  });
};
