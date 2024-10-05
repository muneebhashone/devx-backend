import { InferSelectModel } from "drizzle-orm";
import { builder } from "../../builder";
import { comments } from "../../models/drizzle/schema";
import { Media, MediaInput } from "../common/common.schema";
import { IMedia } from "../../types";

export interface IComment extends InferSelectModel<typeof comments> {}

export const Comment = builder.objectRef<IComment>("Comment").implement({
  fields: (t) => ({
    id: t.exposeInt("id"),
    userId: t.exposeInt("userId"),
    postId: t.exposeInt("postId"),
    content: t.exposeString("content"),
    media: t.field({
      type: t.listRef(Media),
      nullable: true,
      resolve: (comment) => comment.media as IMedia[] | null,
    }),
    createdAt: t.exposeString("createdAt"),
    updatedAt: t.exposeString("updatedAt"),
  }),
});

export const CreateCommentInput = builder.inputType("CreateComment", {
  fields: (t) => ({
    postId: t.int({ required: true }),
    content: t.string({ required: true }),
    media: t.field({
      type: t.listRef(MediaInput),
      required: false,
    }),
  }),
});

export const UpdateCommentInput = builder.inputType("UpdateComment", {
  fields: (t) => ({
    id: t.int({ required: true }),
    content: t.string({ required: true }),
    media: t.field({
      type: t.listRef(MediaInput),
      required: false,
    }),
  }),
});

export type ICreateCommentInput = typeof CreateCommentInput.$inferInput;
export type IUpdateCommentInput = typeof UpdateCommentInput.$inferInput;