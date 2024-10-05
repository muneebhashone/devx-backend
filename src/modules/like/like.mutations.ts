import { builder } from "../../builder";
import { wrapResolver } from "../../utils/graphqlUtil";
import { CreateLikeInput, Like } from "./like.schema";
import { createLike, deleteLike } from "./like.service";

builder.mutationField("createLike", (t) =>
  t.field({
    type: Like,
    args: {
      input: t.arg({ type: CreateLikeInput, required: true }),
    },
    
    resolve: wrapResolver(async (_, { input }) => {
      const like = await createLike(input);
      return like;
    }),
  })
);

builder.mutationField("deleteLike", (t) =>
  t.boolean({
    args: {
      userId: t.arg.int({ required: true }),
      postId: t.arg.int({ required: true }),
    },
    resolve: wrapResolver(async (_, { userId, postId }) => {
      return deleteLike(userId, postId);
    }),
  })
);