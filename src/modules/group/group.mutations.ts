import { builder } from "../../builder";
import { ForbiddenError } from "../../utils/errors";
import { wrapResolver } from "../../utils/graphqlUtil";
import { CreatePostInput, Post, UpdatePostInput } from "../post/post.schema";
import {
  createPost,
  deletePostById,
  fetchPost,
  updatePost,
} from "../post/post.service";
import {
  AddGroupMemberInput,
  CreateGroupInput,
  Group,
  GroupMember,
  UpdateGroupInput,
  UpdateGroupMemberRoleInput,
} from "./group.schema";
import {
  addGroupMember,
  createGroup,
  deleteGroup,
  fetchGroupMemberRole,
  removeGroupMember,
  updateGroup,
  updateGroupMemberRole,
} from "./group.service";

const isGroupAdmin = async (userId: number, groupId: number) => {
  const role = await fetchGroupMemberRole(userId, groupId);
  return role === "ADMIN";
};

const isGroupAdminOrModerator = async (userId: number, groupId: number) => {
  const role = await fetchGroupMemberRole(userId, groupId);
  return role === "ADMIN" || role === "MODERATOR";
};

builder.mutationField("createGroup", (t) =>
  t.field({
    type: Group,
    args: {
      input: t.arg({ type: CreateGroupInput, required: true }),
    },
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, { input }, { currentUser }) => {
      return createGroup(input, currentUser.id);
    }),
  })
);

builder.mutationField("updateGroup", (t) =>
  t.field({
    type: Group,
    args: {
      groupId: t.arg.int({ required: true }),
      input: t.arg({ type: UpdateGroupInput, required: true }),
    },
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, { groupId, input }, { currentUser }) => {
      if (!(await isGroupAdmin(currentUser.id, groupId))) {
        throw new ForbiddenError("Only group admins can update group details");
      }
      return updateGroup(groupId, input);
    }),
  })
);

builder.mutationField("deleteGroup", (t) =>
  t.boolean({
    args: {
      groupId: t.arg.int({ required: true }),
    },
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, { groupId }, { currentUser }) => {
      if (!(await isGroupAdmin(currentUser.id, groupId))) {
        throw new ForbiddenError("Only group admins can delete the group");
      }
      return deleteGroup(groupId);
    }),
  })
);

builder.mutationField("addGroupMember", (t) =>
  t.field({
    type: GroupMember,
    args: {
      input: t.arg({ type: AddGroupMemberInput, required: true }),
    },
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, { input }, { currentUser }) => {
      if (!(await isGroupAdminOrModerator(currentUser.id, input.groupId))) {
        throw new ForbiddenError(
          "Only group admins or moderators can add members"
        );
      }
      return addGroupMember(input);
    }),
  })
);

builder.mutationField("removeGroupMember", (t) =>
  t.boolean({
    args: {
      groupId: t.arg.int({ required: true }),
      userId: t.arg.int({ required: true }),
    },
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, { groupId, userId }, { currentUser }) => {
      if (!(await isGroupAdminOrModerator(currentUser.id, groupId))) {
        throw new ForbiddenError(
          "Only group admins or moderators can remove members"
        );
      }
      return removeGroupMember(groupId, userId);
    }),
  })
);

builder.mutationField("updateGroupMemberRole", (t) =>
  t.field({
    type: GroupMember,
    args: {
      input: t.arg({ type: UpdateGroupMemberRoleInput, required: true }),
    },
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, { input }, { currentUser }) => {
      if (!(await isGroupAdmin(currentUser.id, input.groupId))) {
        throw new ForbiddenError("Only group admins can update member roles");
      }
      return updateGroupMemberRole(input);
    }),
  })
);

builder.mutationField("createGroupPost", (t) =>
  t.field({
    type: Post,
    args: {
      groupId: t.arg.int({ required: true }),
      input: t.arg({ type: CreatePostInput, required: true }),
    },
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, { groupId, input }, { currentUser }) => {
      const role = await fetchGroupMemberRole(currentUser.id, groupId);
      if (!role) {
        throw new ForbiddenError("Only group members can create posts");
      }
      return createPost({ ...input, groupId }, currentUser.id);
    }),
  })
);

builder.mutationField("updateGroupPost", (t) =>
  t.field({
    type: Post,
    args: {
      postId: t.arg.int({ required: true }),
      input: t.arg({ type: UpdatePostInput, required: true }),
    },
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, { postId, input }, { currentUser }) => {
      const post = await fetchPost(postId);
      if (!post) {
        throw new Error("Post not found");
      }
      if (
        post.userId !== currentUser.id &&
        !(await isGroupAdminOrModerator(currentUser.id, post.groupId!))
      ) {
        throw new ForbiddenError(
          "You don't have permission to update this post"
        );
      }
      return updatePost({ ...input, id: postId }, currentUser.id);
    }),
  })
);

builder.mutationField("deleteGroupPost", (t) =>
  t.boolean({
    args: {
      postId: t.arg.int({ required: true }),
    },
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, { postId }, { currentUser }) => {
      const post = await fetchPost(postId);
      if (!post) {
        throw new Error("Post not found");
      }
      if (
        post.userId !== currentUser.id &&
        !(await isGroupAdminOrModerator(currentUser.id, post.groupId!))
      ) {
        throw new ForbiddenError(
          "You don't have permission to delete this post"
        );
      }
      return deletePostById(postId);
    }),
  })
);
