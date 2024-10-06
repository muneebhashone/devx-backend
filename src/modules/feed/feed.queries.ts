import { builder } from "../../builder";
import { wrapResolver } from "../../utils/graphqlUtil";
import { Post } from "../post/post.schema";
import { fetchUserFeedPosts } from "./feed.service";

builder.queryField("userFeed", (t) =>
  t.field({
    type: [Post],
    args: {
      limit: t.arg.int({ defaultValue: 20, required: true }),
      offset: t.arg.int({ defaultValue: 0, required: true }),
    },
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, { limit, offset }, { currentUser }) => {
      return fetchUserFeedPosts(currentUser.id, limit, offset);
    }),
  })
);