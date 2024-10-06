import { InferSelectModel } from "drizzle-orm";
import { builder } from "../../builder";
import { follows } from "../../models/drizzle/schema";
import { IUser, User } from "../user/user.schema";

export interface IFollow extends InferSelectModel<typeof follows> {}

export const Follow = builder.objectRef<IFollowWithUser>("Follow").implement({
  fields: (t) => ({
    id: t.exposeInt("id"),
    followerId: t.exposeInt("followerId"),
    followedId: t.exposeInt("followedId"),
    createdAt: t.expose("createdAt", {
      type: "DateTime",
    }),
    follower: t.field({
      type: AbstractFollowUser,
      nullable: true,
      resolve: (follow) => follow.follower as AbstractFollowUser,
    }),
    followed: t.field({
      type: AbstractFollowUser,
      nullable: true,
      resolve: (follow) => follow.followed as AbstractFollowUser,
    }),
  }),
});

export const CreateFollowInput = builder.inputType("CreateFollowInput", {
  fields: (t) => ({
    followedId: t.int({ required: true }),
  }),
});

export const AbstractFollowUser = builder.objectRef<AbstractFollowUser>("AbstractFollowUser").implement({
  fields: (t) => ({
    avatar: t.exposeString("avatar"),
    name: t.exposeString("name"),
  }),
});

export type ICreateFollowInput = typeof CreateFollowInput.$inferInput;

export interface IFollowWithUser extends IFollow {
  follower?: AbstractFollowUser;
  followed?: AbstractFollowUser;
}

export interface AbstractFollowUser {
  avatar: string | null;
  name: string | null;
}
