import { builder } from "../../builder";
import { wrapResolver } from "../../utils/graphqlUtil";
import { Post } from "../post/post.schema";
import { Group, GroupMember } from "./group.schema";
import { fetchGroupById, fetchGroupMembers, fetchGroupPosts } from "./group.service";

builder.queryField("group", (t) =>
  t.field({
    type: Group,
    args: {
      groupId: t.arg.int({ required: true }),
    },
    resolve: wrapResolver(async (_, { groupId }) => {
      return fetchGroupById(groupId);
    }),
  })
);

builder.queryField("groupMembers", (t) =>
  t.field({
    type: t.listRef(GroupMember),
    args: {
      groupId: t.arg.int({ required: true }),
    },
    resolve: wrapResolver(async (_, { groupId }) => {
      return fetchGroupMembers(groupId);
    }),
  })
);

builder.queryField("groupPosts", (t) =>
  t.field({
    type: t.listRef(Post),
    args: {
      groupId: t.arg.int({ required: true }),
    },
    resolve: wrapResolver(async (_, { groupId }) => {
      return fetchGroupPosts(groupId);
    }),
  })
);