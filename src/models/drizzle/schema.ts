import {
  boolean,
  date,
  pgTable,
  serial,
  varchar
} from "drizzle-orm/pg-core";

import { pgEnum } from "drizzle-orm/pg-core";
import { rolesEnums, statusEnums } from "../../enums";

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
