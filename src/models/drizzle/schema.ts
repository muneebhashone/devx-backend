import {
  boolean,
  date,
  integer,
  json,
  pgTable,
  serial,
  unique,
  varchar
} from "drizzle-orm/pg-core";

import { pgEnum } from "drizzle-orm/pg-core";
import { notificationTypeEnums, rolesEnums, statusEnums } from "../../enums";

export const rolePgEnum = pgEnum("ROLE", rolesEnums);
export const statusPgEnum = pgEnum("USER_STATUS", statusEnums);
export const pgNotificationTypeEnum = pgEnum("NOTIFICATION_TYPE", notificationTypeEnums);

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

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: pgNotificationTypeEnum("type").notNull(),
  data: json("data").$type<NotificationDataJsonType>(),
  createdAt: date("created_at").defaultNow().notNull(),
});
