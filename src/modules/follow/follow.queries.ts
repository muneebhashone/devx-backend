import { builder } from "../../builder";
import { wrapResolver } from "../../utils/graphqlUtil";
import { Follow } from "./follow.schema";
import { fetchUserFollowers, fetchUserFollowing } from "./follow.service";

builder.queryField("userFollowers", (t) =>
  t.field({
    type: [Follow],
    args: {
      userId: t.arg.int({ required: true }),
    },
    resolve: wrapResolver(async (_, { userId }) => {
      return fetchUserFollowers(userId);
    }),
  })
);

builder.queryField("userFollowing", (t) =>
  t.field({
    type: [Follow],
    args: {
      userId: t.arg.int({ required: true }),
    },
    resolve: wrapResolver(async (_, { userId }) => {
      return fetchUserFollowing(userId);
    }),
  })
);