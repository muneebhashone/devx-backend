import {
  boolean,
  date,
  integer,
  json,
  pgTable,
  serial,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

import { pgEnum } from "drizzle-orm/pg-core";
import { MediaType, notificationTypeEnums, rolesEnums, statusEnums } from "../../enums";
import { InferSelectModel, relations } from "drizzle-orm";

export const rolePgEnum = pgEnum("ROLE", rolesEnums);
export const statusPgEnum = pgEnum("USER_STATUS", statusEnums);
export const pgNotificationTypeEnum = pgEnum(
  "NOTIFICATION_TYPE",
  notificationTypeEnums
);

export type ResetToken = {
  token: string;
  expiresAt: Date;
};

export type NotificationDataJsonType = {
  name: string;
  avatar: string;
  content: string;
  goto: string;
};

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email").unique(),
  username: varchar("username").notNull(),
  name: varchar("name"),
  avatar: varchar("avatar"),
  githubId: varchar("github_id"),
  isActive: boolean("is_active").default(false),
  password: varchar("password").notNull(),
  createdAt: date("created_at").defaultNow().notNull(),
  updatedAt: date("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  posts: many(posts),
  comments: many(comments),
  likes: many(likes),
  bookmarks: many(bookmarks),
  follows: many(follows),
  notifications: many(notifications),
  reels: many(reels),
  userFeed: one(userFeed, {
    fields: [users.id],
    references: [userFeed.userId],
  }),
  group: many(groupMembers),
  events: many(eventMembers),
}));

export type Media = {
  url: string;
  type: MediaType;
};

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: varchar("title").notNull(),
  content: varchar("content").notNull(),
  media: json("media").$type<Media[]>(),
  likeCount: integer("like_count").default(0),
  groupId: integer("group_id").references(() => groups.id),
  createdAt: date("created_at").defaultNow().notNull(),
  updatedAt: date("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const postShareTypePgEnum = pgEnum("POST_SHARE_TYPE", ["group", "user", "all"]);

export const postShares = pgTable("post_shares", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => posts.id),
  sharedToTypes: postShareTypePgEnum("shared_to_type"),
  sharedById: integer("shared_by_id").references(() => users.id),
  sharedToGroupId: integer("shared_to_group_id").references(() => groups.id),
  sharedToUserId: integer("shared_to_user_id").references(() => users.id),
  createdAt: date("created_at").defaultNow().notNull(),
});

export const postSharesRelations = relations(postShares, ({ one }) => ({  
  post: one(posts, {
    fields: [postShares.postId],
    references: [posts.id],
  }),
  sharedBy: one(users, {
    fields: [postShares.sharedById],
    references: [users.id],
  }),
  sharedToGroup: one(groups, {
    fields: [postShares.sharedToGroupId],
    references: [groups.id],
  }),
  sharedToUser: one(users, {
    fields: [postShares.sharedToUserId],
    references: [users.id],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  group: one(groups, {
    fields: [posts.groupId],
    references: [groups.id],
  }),
  comments: many(comments),
  likes: many(likes),
  bookmarks: many(bookmarks),
  postShares: many(postShares),
}));

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  postId: integer("post_id").references(() => posts.id),
  content: varchar("content").notNull(),
  media: json("media").$type<Media[]>(),
  createdAt: date("created_at").defaultNow().notNull(),
  updatedAt: date("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  replies: many(replies),
}));

export const replies = pgTable("replies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  parentCommentId: integer("parent_comment_id").references(() => comments.id),
  content: varchar("content").notNull(),
  createdAt: date("created_at").defaultNow().notNull(),
  updatedAt: date("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const repliesRelations = relations(replies, ({ one }) => ({
  user: one(users, {
    fields: [replies.userId],
    references: [users.id],
  }),
  parentComment: one(comments, {
    fields: [replies.parentCommentId],
    references: [comments.id],
  }),
}));

export const likes = pgTable(
  "likes",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id),
    postId: integer("post_id").references(() => posts.id),
    commentId: integer("comment_id").references(() => comments.id),
    createdAt: date("created_at").defaultNow().notNull(),
  },
  (table) => ({
    unique: unique().on(table.userId, table.postId, table.commentId),
  })
);

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
  comment: one(comments, {
    fields: [likes.commentId],
    references: [comments.id],
  }),
}));

export const bookmarks = pgTable(
  "bookmarks",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id),
    postId: integer("post_id").references(() => posts.id),
    createdAt: date("created_at").defaultNow().notNull(),
  },
  (table) => ({
    unique: unique().on(table.userId, table.postId),
  })
);

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [bookmarks.postId],
    references: [posts.id],
  }),
}));

export const follows = pgTable(
  "follows",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id),
    followingId: integer("following_id").references(() => users.id),
    createdAt: date("created_at").defaultNow().notNull(),
  },
  (table) => ({
    unique: unique().on(table.userId, table.followingId),
  })
);

export const followsRelations = relations(follows, ({ one }) => ({
  user: one(users, {
    fields: [follows.userId],
    references: [users.id],
  }),
  following: one(users, {
    fields: [follows.followingId],
    references: [users.id],
  }),
}));

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: pgNotificationTypeEnum("type").notNull(),
  data: json("data").$type<NotificationDataJsonType>(),
  createdAt: date("created_at").defaultNow().notNull(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const reels = pgTable("reels", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  video: varchar("video").notNull(),
  caption: varchar("caption"),
  createdAt: date("created_at").defaultNow().notNull(),
});

export const reelsRelations = relations(reels, ({ one }) => ({
  user: one(users, {
    fields: [reels.userId],
    references: [users.id],
  }),
}));

export const userFeed = pgTable("user_feed", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  posts: json("posts").$type<InferSelectModel<typeof posts>[]>(),
  createdAt: date("created_at").defaultNow().notNull(),
  updatedAt: date("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
  expiresAt: date("expires_at").notNull(),
});

export const userFeedRelations = relations(userFeed, ({ one }) => ({
  user: one(users, {
    fields: [userFeed.userId],
    references: [users.id],
  }),
}));

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: varchar("description"),
  isPublic: boolean("is_public").default(false),
  cover: varchar("cover"),
  avatar: varchar("avatar"),
  createdAt: date("created_at").defaultNow().notNull(),
  updatedAt: date("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const groupMembers = pgTable("group_members", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").references(() => groups.id),
  userId: integer("user_id").references(() => users.id),
  createdAt: date("created_at").defaultNow().notNull(),
});

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [groupMembers.userId],
    references: [users.id],
  }),
}));

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").references(() => groups.id),
  title: varchar("title").notNull(),
  description: varchar("description"),
  location: varchar("location"),
  startAt: date("start_at").notNull(),
  endAt: date("end_at").notNull(),
  createdAt: date("created_at").defaultNow().notNull(),
  updatedAt: date("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const eventsRelations = relations(events, ({ one }) => ({
  group: one(groups, {
    fields: [events.groupId],
    references: [groups.id],
  }),
}));

export const eventMembers = pgTable("event_members", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id),
  userId: integer("user_id").references(() => users.id),
  createdAt: date("created_at").defaultNow().notNull(),
});

export const eventMembersRelations = relations(eventMembers, ({ one }) => ({
  event: one(events, {
    fields: [eventMembers.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventMembers.userId],
    references: [users.id],
  }),
}));

export const groupPosts = pgTable("group_posts", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").references(() => groups.id),
  postId: integer("post_id").references(() => posts.id),
  createdAt: date("created_at").defaultNow().notNull(),
});

export const groupPostsRelations = relations(groupPosts, ({ one }) => ({
  group: one(groups, {
    fields: [groupPosts.groupId],
    references: [groups.id],
  }),
  post: one(posts, {
    fields: [groupPosts.postId],
    references: [posts.id],
  }),
}));  



