import { InferSelectModel } from "drizzle-orm";
import { posts, users, categories } from "../models/drizzle/schema";
import { StatusType } from "../schema/enums";

export type Post = InferSelectModel<typeof posts>;
export type User = InferSelectModel<typeof users>;
export type Category = InferSelectModel<typeof categories>;

export interface IPost extends Post {
  user: User;
  categories: Category[];
}

export interface IFeedConnection {
  items: IPost[];
  nextCursor: number | null;
}

export interface ICreatePostInput {
  title: string;
  content: string;
  userId: number;
  status: StatusType;
  categoryId: number[];
  description: string;
}