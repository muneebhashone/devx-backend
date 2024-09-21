import { builder } from "../builder";
import { Category, Post, User, FeedConnection } from "../schema";
import { fetchCategories } from "../services/categories";
import { fetchPosts } from "../services/post";
import { fetchUser, fetchUsers } from "../services/user";
import { fetchFeedItems } from "../services/feed";
import { wrapResolver } from "../utils/graphqlUtil";

builder.queryField("posts", (t) =>
  t.field({
    type: t.listRef(Post),
    resolve: wrapResolver(async () => {
      return fetchPosts();
    }),
  })
);

builder.queryField("categories", (t) =>
  t.field({
    type: t.listRef(Category),
    resolve: wrapResolver(async () => {
      return fetchCategories();
    }),
  })
);

builder.queryField("users", (t) =>
  t.field({
    type: t.listRef(User),
    resolve: wrapResolver(async () => {
      return fetchUsers();
    }),
  })
);

builder.queryField("user", (t) =>
  t.field({
    type: User,
    args: {
      userId: t.arg({ type: "ID", required: true }),
    },
    resolve: wrapResolver(async (_, { userId }) => {
      return fetchUser(userId);
    }),
  })
);

builder.queryField("feed", (t) =>
  t.field({
    type: FeedConnection,
    args: {
      cursor: t.arg.int({ required: false }),
      limit: t.arg.int({ required: false }),
    },
    resolve: wrapResolver(async (_, { cursor, limit }) => {
      return fetchFeedItems(cursor ?? null, limit ?? 20);
    }),
  })
);
