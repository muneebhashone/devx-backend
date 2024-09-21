import { builder } from "../../builder";
import { wrapResolver } from "../../utils/graphqlUtil";
import { LoginUserInput, LoginUserReturn } from "./auth.schema";
import { loginUser } from "./auth.service";

builder.mutationField("loginUser", (t) =>
    t.field({
      type: LoginUserReturn,
      args: {
        input: t.arg({ type: LoginUserInput, required: true }),
      },
      resolve: wrapResolver(async (_, { input }) => {
        return loginUser(input);
      }),
    })
  );