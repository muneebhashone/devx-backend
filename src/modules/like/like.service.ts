import { eq, and } from "drizzle-orm";
import { db } from "../../lib/drizzle";
import { likes } from "../../models/drizzle/schema";
import { ILike, ICreateLikeInput } from "./like.schema";

export const createLike = async (payload: ICreateLikeInput): Promise<ILike> => {
  const existingLike = await db.query.likes.findFirst({
    where: and(
      eq(likes.userId, payload.userId),
      eq(likes.postId, payload.postId)
    ),
  });

  if (existingLike) {
    throw new Error("User has already liked this post");
  }

  const [newLike] = await db
    .insert(likes)
    .values(payload)
    .returning()
    .execute();

  return newLike;
};

export const deleteLike = async (userId: number, postId: number): Promise<boolean> => {
  const result = await db
    .delete(likes)
    .where(
      and(
        eq(likes.userId, userId),
        eq(likes.postId, postId)
      )
    )
    .execute();

  return result.count > 0;
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