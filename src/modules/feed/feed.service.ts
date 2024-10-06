import { eq } from "drizzle-orm";
import { db } from "../../lib/drizzle";
import { userFeed } from "../../models/drizzle/schema";
import { IPost } from "../post/post.schema";
import { IUserFeed } from "./feed.schema";

const MAX_FEED_POSTS = 100;

export const getUserFeed = async (userId: number): Promise<IUserFeed | null> => {
  const feed = await db.query.userFeed.findFirst({
    where: eq(userFeed.userId, userId),
  });

  return feed ?? null;
};

export const updateUserFeed = async (userId: number, newPost: IPost): Promise<void> => {
  const feed = await getUserFeed(userId);

  if (feed) {
    const updatedPosts = [newPost, ...(feed.posts ?? [])]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, MAX_FEED_POSTS);

    await db
      .update(userFeed)
      .set({ posts: updatedPosts, updatedAt: new Date() })
      .where(eq(userFeed.userId, userId));
  } else {
    try {
        await db.insert(userFeed).values({
          userId,
          posts: [newPost],
        });
        
    } catch (error) {
        console.log({error})
    }
  }
};

export const fetchUserFeedPosts = async (userId: number, limit: number = 20, offset: number = 0): Promise<IPost[]> => {
  const feed = await getUserFeed(userId);
  console.log({feed})
  if (!feed || !feed.posts) {
    return [];
  }

  return feed.posts.slice(offset, offset + limit);
};