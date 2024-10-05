import { builder } from "../../builder";
import { wrapResolver } from "../../utils/graphqlUtil";
import { CreateLikeInput } from "./like.schema";
import { createLike, deleteLike } from "./like.service";

builder.mutationField("createLike", (t) =>
  t.boolean({
    args: {
      input: t.arg({ type: CreateLikeInput, required: true }),
    },
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, { input }, { currentUser }) => {
      const like = await createLike(input, currentUser.id);
      return like;
    }),
  })
);

builder.mutationField("deleteLike", (t) =>
  t.boolean({
    args: {
      postId: t.arg.int({ required: true }),
    },
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, { postId }, { currentUser }) => {
      return deleteLike(currentUser.id, postId);
    }),
  })
);