import { builder } from "../../builder";
import { wrapResolver } from "../../utils/graphqlUtil";
import { Follow, CreateFollowInput } from "./follow.schema";
import { createFollow, deleteFollow } from "./follow.service";

builder.mutationField("createFollow", (t) =>
  t.field({
    type: Follow,
    args: {
      input: t.arg({ type: CreateFollowInput, required: true }),
    },
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, { input }, { currentUser }) => {
      return createFollow(input, currentUser.id);
    }),
  })
);

builder.mutationField("deleteFollow", (t) =>
  t.boolean({
    args: {
      followedId: t.arg.int({ required: true }),
    },
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, { followedId }, { currentUser }) => {
      return deleteFollow(followedId, currentUser.id);
    }),
  })
);