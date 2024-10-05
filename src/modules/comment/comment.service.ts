import { and, eq } from "drizzle-orm";
import { db } from "../../lib/drizzle";
import { comments, posts } from "../../models/drizzle/schema";
import { IComment, ICreateCommentInput, IUpdateCommentInput } from "./comment.schema";
import { IMedia } from "../../types";

export const createComment = async (
  payload: ICreateCommentInput,
  userId: number
): Promise<IComment> => {
  const [newComment] = await db
    .insert(comments)
    .values({ ...payload, userId, media: payload.media as IMedia[] })
    .returning();

  return newComment;
};

export const updateComment = async (
  payload: IUpdateCommentInput,
  userId: number
): Promise<IComment> => {
  const [updatedComment] = await db
    .update(comments)
    .set({ content: payload.content, media: payload.media as IMedia[] })
    .where(and(eq(comments.id, payload.id), eq(comments.userId, userId)))
    .returning();

  if (!updatedComment) {
    throw new Error("Comment not found or user not authorized to update");
  }

  return updatedComment;
};

export const deleteComment = async (
  commentId: number,
  userId: number
): Promise<boolean> => {
  const result = await db
    .delete(comments)
    .where(and(eq(comments.id, commentId), eq(comments.userId, userId)))
    .execute();

  return result.count > 0;
};

export const deleteOtherUserComment = async (
  commentId: number,
  postId: number,
  userId: number
): Promise<boolean> => {
  const post = await db.query.posts.findFirst({
    where: and(eq(posts.id, postId), eq(posts.userId, userId)),
  });

  if (!post) {
    throw new Error("Post not found or user not authorized to delete comments");
  }

  const result = await db
    .delete(comments)
    .where(and(eq(comments.id, commentId), eq(comments.postId, postId)))
    .execute();

  return result.count > 0;
};

export const fetchCommentsByPost = async (postId: number): Promise<IComment[]> => {
  const postComments = await db.query.comments.findMany({
    where: eq(comments.postId, postId),
  });

  return postComments;
};

export const fetchCommentsByUser = async (userId: number): Promise<IComment[]> => {
  const userComments = await db.query.comments.findMany({
    where: eq(comments.userId, userId),
  });

  return userComments;
};