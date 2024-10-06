import { InferSelectModel } from "drizzle-orm";
import { builder } from "../../builder";
import { groups, groupMembers } from "../../models/drizzle/schema";
import { GroupRoleTypeGraphQLEnum } from "../../enums";

export interface IGroup extends InferSelectModel<typeof groups> {}
export interface IGroupMember extends InferSelectModel<typeof groupMembers> {}

export const Group = builder.objectRef<IGroup>("Group").implement({
  fields: (t) => ({
    id: t.exposeInt("id"),
    name: t.exposeString("name"),
    description: t.exposeString("description", { nullable: true }),
    isPublic: t.exposeBoolean("isPublic"),
    cover: t.exposeString("cover", { nullable: true }),
    avatar: t.exposeString("avatar", { nullable: true }),
    createdAt: t.exposeString("createdAt"),
    updatedAt: t.exposeString("updatedAt"),
  }),
});

export const GroupMember = builder.objectRef<IGroupMember>("GroupMember").implement({
  fields: (t) => ({
    id: t.exposeInt("id"),
    role: t.exposeString("role"),
    groupId: t.exposeInt("groupId"),
    userId: t.exposeInt("userId"),
    createdAt: t.exposeString("createdAt"),
  }),
});

export const CreateGroupInput = builder.inputType("CreateGroupInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    description: t.string(),
    isPublic: t.boolean({ required: true }),
    cover: t.string(),
    avatar: t.string(),
  }),
});

export const UpdateGroupInput = builder.inputType("UpdateGroupInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    description: t.string({ required: false }),
    isPublic: t.boolean({ required: false }),
    cover: t.string({ required: false }),
    avatar: t.string({ required: false }),
  }),
});

export const AddGroupMemberInput = builder.inputType("AddGroupMemberInput", {
  fields: (t) => ({
    groupId: t.int({ required: true }),
    userId: t.int({ required: true }),
    role: t.field({ type: GroupRoleTypeGraphQLEnum, required: true }),
  }),
});

export const UpdateGroupMemberRoleInput = builder.inputType("UpdateGroupMemberRoleInput", {
  fields: (t) => ({
    groupId: t.int({ required: true }),
    userId: t.int({ required: true }),
    role: t.field({ type: GroupRoleTypeGraphQLEnum, required: true }),
  }),
});

export type ICreateGroupInput = typeof CreateGroupInput.$inferInput;
export type IUpdateGroupInput = typeof UpdateGroupInput.$inferInput;
export type IAddGroupMemberInput = typeof AddGroupMemberInput.$inferInput;
export type IUpdateGroupMemberRoleInput = typeof UpdateGroupMemberRoleInput.$inferInput;