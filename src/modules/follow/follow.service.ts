import { and, eq } from "drizzle-orm";
import { db } from "../../lib/drizzle";
import { follows, users } from "../../models/drizzle/schema";
import { IFollow, ICreateFollowInput, IFollowWithUser } from "./follow.schema";

export const createFollow = async (input: ICreateFollowInput, followerId: number): Promise<IFollow> => {
  if (input.followedId === followerId) {
    throw new Error("You cannot follow yourself");
  }

  const [follow] = await db.insert(follows).values({ ...input, followerId }).returning();
  return follow;
};

export const deleteFollow = async (followedId: number, followerId: number): Promise<boolean> => {
  const result = await db
    .delete(follows)
    .where(and(eq(follows.followedId, followedId), eq(follows.followerId, followerId)))
    .returning({ deletedId: follows.id });
  
  return result.length > 0;
};

export const fetchUserFollowers = async (userId: number): Promise<IFollowWithUser[]> => {
  return await db.query.follows.findMany({
    where: eq(follows.followedId, userId),
    with: {
      follower: {
        columns: {
          avatar: true,
          name: true,
        },
      },
    },
  });
};

export const fetchUserFollowing = async (userId: number): Promise<IFollowWithUser[]> => {
  return await db.query.follows.findMany({
    where: eq(follows.followerId, userId),
    with: {
      followed: {
        columns: {
          avatar: true,
          name: true,
        },
      },
    },
  });
};