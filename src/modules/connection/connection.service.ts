import { and, eq } from "drizzle-orm";
import { db } from "../../lib/drizzle";
import { connections } from "../../models/drizzle/schema";
import { IConnection, IConnectionWithUser, ICreateConnectionInput, IUpdateConnectionStatusInput } from "./connection.schema";

export const createConnection = async (input: ICreateConnectionInput, userId: number): Promise<IConnection> => {
  if (input.connectedUserId === userId) {
    throw new Error("You cannot connect with yourself");
  }

  const [connection] = await db.insert(connections).values({ ...input, userId }).returning();
  return connection;
};

export const updateConnectionStatus = async (input: IUpdateConnectionStatusInput, userId: number): Promise<IConnection> => {
  const [connection] = await db
    .update(connections)
    .set({ status: input.status })
    .where(and(eq(connections.id, input.connectionId), eq(connections.userId, userId)))
    .returning();
  
  if (!connection) {
    throw new Error("Connection not found or you don't have permission to update it");
  }
  
  return connection;
};

export const fetchUserConnections = async (userId: number): Promise<IConnectionWithUser[]> => {
  return db.query.connections.findMany({
    where: eq(connections.userId, userId),
    with: {
      connectedUser: {
        columns: {
          avatar: true,
          name: true,
        },
      },
    },
  });
};
