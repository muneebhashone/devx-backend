import { builder } from "../../builder";
import { Comment } from "./comment.schema";
import { wrapResolver } from "../../utils/graphqlUtil";
import { fetchCommentsByPost, fetchCommentsByUser } from "./comment.service";

builder.queryField("commentsByPost", (t) =>
  t.field({
    type: t.listRef(Comment),
    args: {
      postId: t.arg.int({ required: true }),
    },
    resolve: wrapResolver(async (_, { postId }) => {
      return fetchCommentsByPost(postId);
    }),
  })
);

builder.queryField("commentsByUser", (t) =>
  t.field({
    type: t.listRef(Comment),
    args: {
      userId: t.arg.int({ required: true }),
    },
    resolve: wrapResolver(async (_, { userId }) => {
      return fetchCommentsByUser(userId);
    }),
  })
);