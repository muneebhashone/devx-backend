import { and, eq, InferInsertModel } from "drizzle-orm";
import { db } from "../../lib/drizzle";
import { groupMembers, groups, posts } from "../../models/drizzle/schema";
import { IAddGroupMemberInput, IGroup, IGroupMember, IUpdateGroupMemberRoleInput } from "./group.schema";
import { IPost } from "../post/post.schema";

export const createGroup = async (payload: InferInsertModel<typeof groups>, userId: number): Promise<IGroup> => {
  const [group] = await db.insert(groups).values(payload).returning();
  await db.insert(groupMembers).values({ groupId: group.id, userId, role: "ADMIN" });
  return group;
};

export const updateGroup = async (groupId: number, payload: InferInsertModel<typeof groups>): Promise<IGroup> => {
  const [updatedGroup] = await db.update(groups).set(payload).where(eq(groups.id, groupId)).returning();
  return updatedGroup;
};

export const deleteGroup = async (groupId: number): Promise<boolean> => {
  await db.delete(groups).where(eq(groups.id, groupId));
  return true;
};

export const addGroupMember = async (payload: IAddGroupMemberInput): Promise<IGroupMember> => {
  const [member] = await db.insert(groupMembers).values(payload).returning();
  return member;
};

export const removeGroupMember = async (groupId: number, userId: number): Promise<boolean> => {
  await db.delete(groupMembers).where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId)));
  return true;
};

export const updateGroupMemberRole = async (payload: IUpdateGroupMemberRoleInput): Promise<IGroupMember> => {
  const [updatedMember] = await db
    .update(groupMembers)
    .set({ role: payload.role })
    .where(and(eq(groupMembers.groupId, payload.groupId), eq(groupMembers.userId, payload.userId)))
    .returning();

  return updatedMember;
};

export const fetchGroupById = async (groupId: number): Promise<IGroup | null> => {
  const group = await db.query.groups.findFirst({ where: eq(groups.id, groupId) });
  return group ?? null;
};

export const fetchGroupMembers = async (groupId: number): Promise<IGroupMember[]> => {
  const members = await db.query.groupMembers.findMany({ where: eq(groupMembers.groupId, groupId) });
  return members ?? [];
};

export const fetchGroupPosts = async (groupId: number): Promise<IPost[]> => {
  const groupPosts = await db.query.posts.findMany({ where: eq(posts.groupId, groupId) });
  return groupPosts ?? [];
};

export const fetchGroupMemberRole = async (userId: number, groupId: number): Promise<string | null> => {
  const member = await db.query.groupMembers.findFirst({
    where: and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId)),
  });
  return member?.role ?? null;
};
