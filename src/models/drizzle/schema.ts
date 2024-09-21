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
import { notificationTypeEnums, rolesEnums, statusEnums } from "../../enums";
import { relations } from "drizzle-orm";

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

export const usersRelations = relations(users, ({ many }) => ({
  feeds: many(feeds),
  comments: many(comments),
  likes: many(likes),
  bookmarks: many(bookmarks),
  follows: many(follows),
  notifications: many(notifications),
}));

export type Media = {
  url: string;
  type: "image" | "video" | "link";
};

export const feeds = pgTable("feeds", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: varchar("title").notNull(),
  content: varchar("content").notNull(),
  media: json("media").$type<Media[]>(),
  createdAt: date("created_at").defaultNow().notNull(),
  updatedAt: date("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const feedsRelations = relations(feeds, ({ one, many }) => ({
  user: one(users, {
    fields: [feeds.userId],
    references: [users.id],
  }),
  comments: many(comments),
  likes: many(likes),
  bookmarks: many(bookmarks),
}));

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  feedId: integer("feed_id").references(() => feeds.id),
  content: varchar("content").notNull(),
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
  feed: one(feeds, {
    fields: [comments.feedId],
    references: [feeds.id],
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
    feedId: integer("feed_id").references(() => feeds.id),
    createdAt: date("created_at").defaultNow().notNull(),
  },
  (table) => ({
    unique: unique().on(table.userId, table.feedId),
  })
);

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  feed: one(feeds, {
    fields: [likes.feedId],
    references: [feeds.id],
  }),
}));

export const bookmarks = pgTable(
  "bookmarks",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id),
    feedId: integer("feed_id").references(() => feeds.id),
    createdAt: date("created_at").defaultNow().notNull(),
  },
  (table) => ({
    unique: unique().on(table.userId, table.feedId),
  })
);

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
  feed: one(feeds, {
    fields: [bookmarks.feedId],
    references: [feeds.id],
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
