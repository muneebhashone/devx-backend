import { builder } from "../../builder";
import { FeedConnection } from "../../schema";
import { wrapResolver } from "../../utils/graphqlUtil";
import { fetchFeedItems } from "./feed.service";

builder.queryField("feed", (t) =>
    t.field({
      type: FeedConnection,
      args: {
        cursor: t.arg.int({ required: false }),
        limit: t.arg.int({ required: false }),
      },
      resolve: wrapResolver(async (_, { cursor, limit }) => {
        return fetchFeedItems(cursor ?? null, limit ?? 20);
      }),
    })
  );