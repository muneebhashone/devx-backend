import { builder } from "../../builder";
import { wrapResolver } from "../../utils/graphqlUtil";
import { Connection } from "./connection.schema";
import { fetchUserConnections } from "./connection.service";

builder.queryField("userConnections", (t) =>
  t.field({
    type: [Connection],
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, __, { currentUser }) => {
      return fetchUserConnections(currentUser.id);
    }),
  })
);