import { builder } from "../../builder";
import { wrapResolver } from "../../utils/graphqlUtil";
import { CreatePostInput, UpdatePostInput, Post } from "./post.schema";
import { createPost, updatePost, deletePost } from "./post.service";

builder.mutationField("createPost", (t) =>
  t.field({
    type: Post,
    args: {
      input: t.arg({ type: CreatePostInput, required: true }),
    },
    resolve: wrapResolver(async (_, { input }, ctx) => {
      if (!ctx.user) throw new Error("Not authenticated");
      return createPost(input, ctx.user.id);
    }),
  })
);

builder.mutationField("updatePost", (t) =>
  t.field({
    type: Post,
    args: {
      input: t.arg({ type: UpdatePostInput, required: true }),
    },
    resolve: wrapResolver(async (_, { input }, ctx) => {
      if (!ctx.user) throw new Error("Not authenticated");
      return updatePost(input, ctx.user.id);
    }),
  })
);

builder.mutationField("deletePost", (t) =>
  t.field({
    type: "Boolean",
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: wrapResolver(async (_, { id }, ctx) => {
      if (!ctx.user) throw new Error("Not authenticated");
      return deletePost(id, ctx.user.id);
    }),
  })
);

// Add these mutations

builder.mutationField("likePost", (t) =>
  t.field({
    type: "Boolean",
    args: {
      postId: t.arg.int({ required: true }),
    },
    resolve: wrapResolver(async (_, { postId }, { user }) => {
      return likePost(postId, user.id);
    }),
  })
);

builder.mutationField("bookmarkPost", (t) =>
  t.field({
    type: "Boolean",
    args: {
      postId: t.arg.int({ required: true }),
    },
    resolve: wrapResolver(async (_, { postId }, { user }) => {
      return bookmarkPost(postId, user.id);
    }),
  })
);

builder.mutationField("commentOnPost", (t) =>
  t.field({
    type: Comment, // You'll need to define this type
    args: {
      postId: t.arg.int({ required: true }),
      content: t.arg.string({ required: true }),
    },
    resolve: wrapResolver(async (_, { postId, content }, { user }) => {
      return commentOnPost(postId, user.id, content);
    }),
  })
);

builder.mutationField("sharePost", (t) =>
  t.field({
    type: "Boolean",
    args: {
      postId: t.arg.int({ required: true }),
      sharedToType: t.arg({ type: PostShareType, required: true }),
      sharedToId: t.arg.int({ required: false }),
    },
    resolve: wrapResolver(async (_, { postId, sharedToType, sharedToId }, { user }) => {
      return sharePost(postId, user.id, sharedToType, sharedToId);
    }),
  })
);