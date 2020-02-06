import { ResolverMap } from "../../types/graphql-utils";
import * as bcrypt from "bcryptjs";
import { User } from "../../entity/User";

export const resolvers: ResolverMap = {
  //Query needed because of an error from graphql-tools that was a problem with merging a schema if it doesn't start with a query.
  Query: {
    bye: () => "bye"
  },
  Mutation: {
    register: async (
      _,
      { email, password }: GQL.IRegisterOnMutationArguments
    ) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({
        email,
        password: hashedPassword
      });

      await user.save();

      return true;
    }
  }
};
