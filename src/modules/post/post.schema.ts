import { InferSelectModel } from "drizzle-orm";
import { builder } from "../../builder";
import { posts } from "../../models/drizzle/schema";
import { IMedia } from "../../types";
import { Media, MediaInput } from "../common/common.schema";

export interface IPost extends InferSelectModel<typeof posts> {}

export const Post = builder.objectRef<IPost>("Post").implement({
  fields: (t) => ({
    id: t.exposeInt("id"),
    userId: t.exposeInt("userId"),
    title: t.exposeString("title"),
    content: t.exposeString("content"),
    media: t.field({
      type: [Media],
      resolve: (post) => post.media as IMedia[],
    }),
    groupId: t.exposeInt("groupId", { nullable: true }),
    createdAt: t.exposeString("createdAt"),
    updatedAt: t.exposeString("updatedAt"),
  }),
});

export const CreatePostInput = builder.inputType("CreatePostInput", {
  fields: (t) => ({
    title: t.string({ required: true }),
    content: t.string({ required: true }),
    media: t.field({ type: [MediaInput], required: false }),
    groupId: t.int({ required: false }),
  }),
});

export const UpdatePostInput = builder.inputType("UpdatePostInput", {
  fields: (t) => ({
    id: t.int({ required: true }),
    title: t.string({ required: false }),
    content: t.string({ required: false }),
    media: t.field({ type: [MediaInput], required: false }),
  }),
});

export type ICreatePostInput = typeof CreatePostInput.$inferInput;
export type IUpdatePostInput = typeof UpdatePostInput.$inferInput;