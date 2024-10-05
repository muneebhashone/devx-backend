import { eq, and } from "drizzle-orm";
import { db } from "../../lib/drizzle";
import { posts } from "../../models/drizzle/schema";
import { IPost, ICreatePostInput, IUpdatePostInput } from "./post.schema";
import { IMedia } from "../../types";

export const createPost = async (input: ICreatePostInput, userId: number): Promise<IPost> => {
  const [post] = await db.insert(posts).values({ ...input, userId }).returning();
  return post;
};

export const updatePost = async (input: IUpdatePostInput, userId: number): Promise<IPost> => {
  const [post] = await db
    .update(posts)
    .set({
      title: input.title as string,
      content: input.content as string,
      media: input.media as IMedia[],
    })
    .where(and(eq(posts.id, input.id), eq(posts.userId, userId)))
    .returning();
  
  if (!post) {
    throw new Error("Post not found or you don't have permission to update it");
  }
  
  return post;
};

export const deletePost = async (id: number, userId: number): Promise<boolean> => {
  const result = await db
    .delete(posts)
    .where(and(eq(posts.id, id), eq(posts.userId, userId)))
    .returning({ deletedId: posts.id });
  
  return result.length > 0;
};

export const fetchPost = async (id: number): Promise<IPost> => {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, id),
  });

  if (!post) {
    throw new Error("Post not found");
  }

  return post;
};

// export const fetchPosts = async (): Promise<IPost[]> => {
//   return db.query.posts.findMany();
// };

export const fetchUserPosts = async (userId: number): Promise<IPost[]> => {
  return db.query.posts.findMany({
    where: eq(posts.userId, userId),
  });
};