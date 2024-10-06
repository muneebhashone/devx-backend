import { builder } from "../../builder";
import { wrapResolver } from "../../utils/graphqlUtil";
import { Connection, CreateConnectionInput, UpdateConnectionStatusInput } from "./connection.schema";
import { createConnection, updateConnectionStatus } from "./connection.service";

builder.mutationField("createConnection", (t) =>
  t.field({
    type: Connection,
    args: {
      input: t.arg({ type: CreateConnectionInput, required: true }),
    },
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, { input }, { currentUser }) => {
      return createConnection(input, currentUser.id);
    }),
  })
);

builder.mutationField("updateConnectionStatus", (t) =>
  t.field({
    type: Connection,
    args: {
      input: t.arg({ type: UpdateConnectionStatusInput, required: true }),
    },
    authScopes: {
      protected: true,
    },
    resolve: wrapResolver(async (_, { input }, { currentUser }) => {
      return updateConnectionStatus(input, currentUser.id);
    }),
  })
);