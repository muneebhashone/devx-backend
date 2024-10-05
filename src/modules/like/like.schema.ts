import { InferSelectModel } from "drizzle-orm";
import { builder } from "../../builder";
import { likes } from "../../models/drizzle/schema";

export interface ILike extends InferSelectModel<typeof likes> {}

export const Like = builder.objectRef<ILike>("Like").implement({
  fields: (t) => ({
    id: t.exposeInt("id"),
    userId: t.exposeInt("userId"),
    postId: t.exposeInt("postId"),
    createdAt: t.exposeString("createdAt"),
  }),
});

export const CreateLikeInput = builder.inputType("CreateLike", {
  fields: (t) => ({
    userId: t.int({ required: true }),
    postId: t.int({ required: true }),
  }),
});

export type ICreateLikeInput = typeof CreateLikeInput.$inferInput;