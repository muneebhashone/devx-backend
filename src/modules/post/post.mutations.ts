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
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, { input }, ctx) => {
      return createPost(input, ctx.currentUser.id);
    }),
  })
);

builder.mutationField("updatePost", (t) =>
  t.field({
    type: Post,
    args: {
      input: t.arg({ type: UpdatePostInput, required: true }),
    },
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, { input }, ctx) => {
      return updatePost(input, ctx.currentUser.id);
    }),
  })
);

builder.mutationField("deletePost", (t) =>
  t.field({
    type: "Boolean",
    args: {
      id: t.arg.int({ required: true }),
    },
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, { id }, ctx) => {
      return deletePost(id, ctx.currentUser.id);
    }),
  })
);