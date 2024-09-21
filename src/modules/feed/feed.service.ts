import { desc, eq, sql } from "drizzle-orm";
import { db } from "../../lib/drizzle";
import { IPost, IFeedConnection } from "../types";
import { posts, users } from "../../models/drizzle/schema";

export const fetchFeedItems = async (cursor: number | null, limit: number = 20): Promise<IFeedConnection> => {
  const query = db
    .select({
      ...posts,
      categories: sql<string>`json_agg(json_build_object('name', ${categories.name}, 'id', ${categories.id}, 'updatedAt', ${categories.updatedAt}, 'createdAt', ${categories.createdAt}, 'description', ${categories.description}))`,
      user: users,
    })
    .from(posts)
    .leftJoin(users, eq(users.id, posts.userId))
    .leftJoin(categoriesPosts, eq(posts.id, categoriesPosts.postId))
    .leftJoin(categories, eq(categoriesPosts.categoryId, categories.id))
    .groupBy(posts.id, users.id)
    .orderBy(desc(posts.createdAt))
    .limit(limit + 1);

  if (cursor) {
    query.where(eq(posts.id, cursor));
  }

  const results = await query;

  const items = results.slice(0, limit) as IPost[];
  const nextCursor = results.length > limit ? results[limit - 1].id : null;

  return { items, nextCursor };
};