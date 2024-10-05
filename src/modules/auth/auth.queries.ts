import { builder } from "../../builder";
import { wrapResolver } from "../../utils/graphqlUtil";
import { User } from "../user/user.schema";
import { getCurrentUser } from "./auth.service";

builder.queryField("getCurrentUser", (t) =>
  t.field({
    type: User,
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, __, { currentUser }) => {
      return getCurrentUser(currentUser.id);
    }),
  })
);
