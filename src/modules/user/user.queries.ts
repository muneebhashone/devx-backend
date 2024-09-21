import { builder } from "../../builder";
import { User } from "./user.schema";
import { wrapResolver } from "../../utils/graphqlUtil";
import { fetchUser, fetchUsers } from "./user.service";

builder.queryField("users", (t) =>
    t.field({
      type: t.listRef(User),
      resolve: wrapResolver(async () => {
        return fetchUsers();
      }),
    })
  );
  
  builder.queryField("user", (t) =>
    t.field({
      type: User,
      args: {
        userId: t.arg({ type: "ID", required: true }),
      },
      resolve: wrapResolver(async (_, { userId }) => {
        return fetchUser(userId);
      }),
    })
  );