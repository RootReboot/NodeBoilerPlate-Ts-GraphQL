/*
import { User } from "../entity/User";
import { Redis } from "ioredis";
import { ContextParameters } from "graphql-yoga/ContextParameters";
import {Request, Response} from ''

export const get = async (req: Request, res: Response, redis: Redis) => {
  const { id } = req.params;
  const userId = await redis.get(id);
  await User.update({ id: userId }, { confirmed: true });
});
*/
