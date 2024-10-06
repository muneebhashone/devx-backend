import { eq, and } from "drizzle-orm";
import { db } from "../../lib/drizzle";
import { posts, connections, follows, groupMembers } from "../../models/drizzle/schema";
import { IPost, ICreatePostInput, IUpdatePostInput } from "./post.schema";
import { IMedia } from "../../types";
import { addFeedJob } from "../feed/feed.jobs";

export const createPost = async (input: ICreatePostInput, userId: number): Promise<IPost> => {
  const [post] = await db.insert(posts).values({ ...input, userId }).returning();

  // Fetch users who should receive this post in their feed
  const usersToNotify = await fetchUsersToNotify(userId, post.groupId);
  console.log({usersToNotify})
  // Add feed jobs for each user
  for (const userToNotify of usersToNotify) {
    await addFeedJob({
      userId: userToNotify,
      postId: post.id,
    });
  }

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

export const deletePostById = async (id: number): Promise<boolean> => {
  const result = await db
    .delete(posts)
    .where(eq(posts.id, id))
    .returning({ deletedId: posts.id });
  
  return result.length > 0;
};

export const fetchPost = async (id: number): Promise<IPost | null> => {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, id),
  });

  return post ?? null;
};

// export const fetchPosts = async (): Promise<IPost[]> => {
//   return db.query.posts.findMany();
// };

export const fetchUserPosts = async (userId: number): Promise<IPost[]> => {
  return db.query.posts.findMany({
    where: eq(posts.userId, userId),
  });
};

const fetchUsersToNotify = async (authorId: number, groupId: number | null): Promise<number[]> => {
  const users = new Set<number>();

  // Add connected users
  const connectedUsers = await db.select({ userId: connections.userId })
    .from(connections)
    .where(and(eq(connections.connectedUserId, authorId), eq(connections.status, "ACCEPTED")));
  connectedUsers.forEach(user => users.add(user.userId));

  // Add followers
  const followers = await db.select({ followerId: follows.followerId })
    .from(follows)
    .where(eq(follows.followedId, authorId));
  followers.forEach(user => users.add(user.followerId));

  // Add group members if the post is in a group
  if (groupId) {
    const fetchedGroupMembers = await db.select({ userId: groupMembers.userId })
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId));
      fetchedGroupMembers.forEach(user => user.userId && users.add(user.userId));
  }

  return Array.from(users);
};