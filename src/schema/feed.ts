import { builder } from "../builder";
import { Post } from "./post";
import { IPost, IFeedConnection } from "../types";
import { fetchFeedItems } from "../services/feed";

export const FeedConnection = builder.objectRef<IFeedConnection>("FeedConnection").implement({
  fields: (t) => ({
    items: t.field({
      type: [Post],
      resolve: (parent) => parent.items,
    }),
    nextCursor: t.field({
      type: "Int",
      nullable: true,
      resolve: (parent) => parent.nextCursor,
    }),
  }),
});

builder.queryField("feed", (t) =>
  t.field({
    type: FeedConnection,
    args: {
      cursor: t.arg.int({ required: false }),
      limit: t.arg.int({ required: false, defaultValue: 20 }),
    },
    resolve: async (_, args) => {
      return fetchFeedItems(args.cursor ?? null, args.limit ?? 20);
    },
  })
);