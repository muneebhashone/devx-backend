import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  text,
  varchar
} from "drizzle-orm/pg-core";

import { pgEnum } from "drizzle-orm/pg-core";
import { rolesEnums, statusEnums } from "../../schema/enums";

export const rolePgEnum = pgEnum("ROLE", rolesEnums);
export const statusPgEnum = pgEnum("USER_STATUS", statusEnums);

export type ResetToken = {
  token: string;
  expiresAt: Date;
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

export const userToPostsRelation = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: varchar("description"),
  content: text("content").notNull(),
  status: statusPgEnum("status").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  createdAt: date("created_at").defaultNow(),
  updatedAt: date("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const postsRelation = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));