import { builder } from "../builder";
import { Category } from "./category";
import { StatusGraphQLEnum } from "./enums";
import { User } from "./user";
import { IPost } from "../types";

export const Post = builder.objectRef<IPost>("Post").implement({
  fields: (t) => ({
    id: t.exposeInt("id"),
    title: t.exposeString("title"),
    description: t.exposeString("description", { nullable: true }),
    content: t.exposeString("content"),
    createdAt: t.field({
      type: "DateTime",
      resolve: (post) => new Date(post.createdAt as string),
    }),
    updatedAt: t.field({
      type: "DateTime",
      resolve: (post) => post.updatedAt ? new Date(post.updatedAt) : null,
    }),
    categories: t.field({
      type: [Category],
      resolve: (post) => post.categories,
    }),
    user: t.field({
      type: User,
      resolve: (post) => post.user,
    }),
  }),
});

export const CreatePostInput = builder.inputType("CreatePost", {
  fields: (t) => ({
    title: t.string({ required: true }),
    content: t.string({ required: true }),
    userId: t.int({ required: true }),
    status: t.field({ type: StatusGraphQLEnum, required: true }),
    categoryId: t.intList({ required: true }),
    description: t.string({ required: true }),
  }),
});

export type ICreatePostInput = typeof CreatePostInput.$inferInput;
