import { eq, and, sql } from "drizzle-orm";
import { db } from "../../lib/drizzle";
import { likes, posts } from "../../models/drizzle/schema";
import { ILike, ICreateLikeInput } from "./like.schema";

export const createLike = async (
  payload: ICreateLikeInput,
  userId: number
): Promise<boolean> => {
  const existingLike = await db.query.likes.findFirst({
    where: and(eq(likes.userId, userId), eq(likes.postId, payload.postId)),
  });

  if (existingLike) {
    throw new Error("User has already liked this post");
  }

  await db.transaction(async (tx) => {
    try {
      await tx
        .insert(likes)
        .values({ ...payload, userId })
        .execute();

      await tx
        .update(posts)
        .set({ likeCount: sql`${posts.likeCount} + 1` })
        .where(eq(posts.id, payload.postId))
        .execute();
    } catch (_) {
      tx.rollback();
      return false;
    }
  });

  return true;
};

export const deleteLike = async (
  userId: number,
  postId: number
): Promise<boolean> => {

   await db.transaction(async (tx) => {
      try {
        await tx.delete(likes).where(and(eq(likes.userId, userId), eq(likes.postId, postId))).execute();
        await tx.update(posts).set({ likeCount: sql`${posts.likeCount} - 1` }).where(eq(posts.id, postId)).execute();
      } catch (_) {
        tx.rollback();
        return false;
      }
    });
    
  return true;
};

export const fetchLikesByPost = async (postId: number): Promise<ILike[]> => {
  const postLikes = await db.query.likes.findMany({
    where: eq(likes.postId, postId),
  });

  return postLikes;
};

export const fetchLikesByUser = async (userId: number): Promise<ILike[]> => {
  const userLikes = await db.query.likes.findMany({
    where: eq(likes.userId, userId),
  });

  return userLikes;
};
