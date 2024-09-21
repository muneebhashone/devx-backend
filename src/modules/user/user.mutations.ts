import { builder } from "../../builder";
import { wrapResolver } from "../../utils/graphqlUtil";
import { CreateUserInput, User } from "./user.schema";
import { createUser } from "./user.service";

builder.mutationField("createUser", (t) =>
    t.field({
      type: User,
      args: {
        input: t.arg({ type: CreateUserInput, required: true }),
      },
      resolve: wrapResolver(async (_, { input }) => {
        const user = await createUser(input);
        return user;
      }),
    })
  );