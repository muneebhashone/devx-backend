import { InferSelectModel } from "drizzle-orm";
import { builder } from "../../builder";
import { users } from "../../models/drizzle/schema";
import { Connection } from "../connection/connection.schema";
import { Follow } from "../follow/follow.schema";
import { fetchUserFollowers, fetchUserFollowing } from "../follow/follow.service";
import { fetchUserConnections } from "../connection/connection.service";

export interface IUser extends InferSelectModel<typeof users> {}

export const User = builder.objectRef<IUser>("User").implement({
  fields: (t) => ({
    id: t.exposeInt("id"),
    username: t.exposeString("username"),
    email: t.exposeString("email"),
    createdAt: t.exposeString("createdAt"),
    updatedAt: t.exposeString("updatedAt"),
    connections: t.field({
      type: [Connection],
      resolve: async (user, _, { currentUser }) => {
        if (user.id !== currentUser.id) {
          throw new Error("You can only view your own connections");
        }
        return fetchUserConnections(user.id);
      },
    }),
    followers: t.field({
      type: [Follow],
      resolve: async (user) => {
        return fetchUserFollowers(user.id);
      },
    }),
    following: t.field({
      type: [Follow],
      resolve: async (user) => {
        return fetchUserFollowing(user.id);
      },
    }),
  }),
});

export const CreateUserInput = builder.inputType("CreateUser", {
  fields: (t) => ({
    email: t.field({ type: "Email", required: true }),
    password: t.string({ required: true }),
    username: t.string({ required: true }),
  }),
});

export type ICreateUserInput = typeof CreateUserInput.$inferInput;
