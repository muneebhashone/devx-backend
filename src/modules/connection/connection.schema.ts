import { InferSelectModel } from "drizzle-orm";
import { builder } from "../../builder";
import { connections } from "../../models/drizzle/schema";
import { ConnectionStatusGraphQLEnum } from "../../enums";

export interface IConnection extends InferSelectModel<typeof connections> {}

export const Connection = builder
  .objectRef<IConnectionWithUser>("Connection")
  .implement({
    fields: (t) => ({
      id: t.exposeInt("id"),
      userId: t.exposeInt("userId"),
      connectedUserId: t.exposeInt("connectedUserId"),
      status: t.expose("status", {
        type: ConnectionStatusGraphQLEnum,
      }),
      connectedUser: t.field({
        type: AbstractConnectionUser,
        nullable: true,
        resolve: (connection) => connection.connectedUser as AbstractConnectionUser,
      }),
      createdAt: t.expose("createdAt", {
        type: "DateTime",
      }),
      updatedAt: t.expose("updatedAt", {
        type: "DateTime",
      }),
    }),
  });

export const CreateConnectionInput = builder.inputType(
  "CreateConnectionInput",
  {
    fields: (t) => ({
      connectedUserId: t.int({ required: true }),
    }),
  }
);

export const UpdateConnectionStatusInput = builder.inputType(
  "UpdateConnectionStatusInput",
  {
    fields: (t) => ({
      connectionId: t.int({ required: true }),
      status: t.field({
        type: ConnectionStatusGraphQLEnum,
        required: true,
      }),
    }),
  }
);

export type ICreateConnectionInput = typeof CreateConnectionInput.$inferInput;
export type IUpdateConnectionStatusInput =
  typeof UpdateConnectionStatusInput.$inferInput;
export interface IConnectionWithUser extends IConnection {
  connectedUser?: {
    avatar: string | null;
    name: string | null;
  };
}

export const AbstractConnectionUser = builder
  .objectRef<AbstractConnectionUser>("AbstractConnectionUser")
  .implement({
    fields: (t) => ({
      avatar: t.exposeString("avatar"),
      name: t.exposeString("name"),
    }),
  });
export interface AbstractConnectionUser {
  avatar: string | null;
  name: string | null;
}
