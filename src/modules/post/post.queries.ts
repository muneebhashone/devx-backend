import { builder } from "../../builder";
import { wrapResolver } from "../../utils/graphqlUtil";
import { Post } from "./post.schema";
import { fetchPost, fetchPosts, fetchUserPosts } from "./post.service";

builder.queryField("post", (t) =>
  t.field({
    type: Post,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: wrapResolver(async (_, { id }) => {
      return fetchPost(id);
    }),
  })
);

builder.queryField("posts", (t) =>
  t.field({
    type: [Post],
    resolve: wrapResolver(async () => {
      return fetchPosts();
    }),
  })
);

builder.queryField("userPosts", (t) =>
  t.field({
    type: [Post],
    args: {
      userId: t.arg.int({ required: true }),
    },
    resolve: wrapResolver(async (_, { userId }) => {
      return fetchUserPosts(userId);
    }),
  })
);