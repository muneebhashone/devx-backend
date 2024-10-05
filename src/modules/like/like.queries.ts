import { builder } from "../../builder";
import { Like } from "./like.schema";
import { wrapResolver } from "../../utils/graphqlUtil";
import { fetchLikesByPost, fetchLikesByUser } from "./like.service";

builder.queryField("likesByPost", (t) =>
  t.field({
    type: t.listRef(Like),
    args: {
      postId: t.arg.int({ required: true }),
    },
    resolve: wrapResolver(async (_, { postId }) => {
      return fetchLikesByPost(postId);
    }),
  })
);

builder.queryField("likesByUser", (t) =>
  t.field({
    type: t.listRef(Like),
    args: {
      userId: t.arg.int({ required: true }),
    },
    resolve: wrapResolver(async (_, { userId }) => {
      return fetchLikesByUser(userId);
    }),
  })
);