import { InferSelectModel } from "drizzle-orm";
import { builder } from "../../builder";
import { userFeed } from "../../models/drizzle/schema";
import { Post } from "../post/post.schema";

export interface IUserFeed extends InferSelectModel<typeof userFeed> {}

export const UserFeed = builder.objectRef<IUserFeed>("UserFeed").implement({
  fields: (t) => ({
    id: t.exposeInt("id"),
    userId: t.exposeInt("userId"),
    posts: t.field({
      type: [Post],
      resolve: (feed) => feed.posts,
    }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
  }),
});

export interface FeedJobData {
  userId: number;
  postId: number;
}