import { builder } from "../../builder";
import { wrapResolver } from "../../utils/graphqlUtil";
import { Comment, CreateCommentInput, UpdateCommentInput } from "./comment.schema";
import { createComment, updateComment, deleteComment, deleteOtherUserComment } from "./comment.service";

builder.mutationField("createComment", (t) =>
  t.field({
    type: Comment,
    args: {
      input: t.arg({ type: CreateCommentInput, required: true }),
    },
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, { input }, { currentUser }) => {
      const comment = await createComment(input, currentUser.id);
      return comment;
    }),
  })
);

builder.mutationField("updateComment", (t) =>
  t.field({
    type: Comment,
    args: {
      input: t.arg({ type: UpdateCommentInput, required: true }),
    },
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, { input }, { currentUser }) => {
      const updatedComment = await updateComment(input, currentUser.id);
      return updatedComment;
    }),
  })
);

builder.mutationField("deleteComment", (t) =>
  t.boolean({
    args: {
      commentId: t.arg.int({ required: true }),
    },
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, { commentId }, { currentUser }) => {
      return deleteComment(commentId, currentUser.id);
    }),
  })
);

builder.mutationField("deleteOtherUserComment", (t) =>
  t.boolean({
    args: {
      commentId: t.arg.int({ required: true }),
      postId: t.arg.int({ required: true }),
    },
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, { commentId, postId }, { currentUser }) => {
      return deleteOtherUserComment(commentId, postId, currentUser.id);
    }),
  })
);