import { eq, InferInsertModel } from "drizzle-orm";
import { db } from "../../lib/drizzle";
import { users } from "../../models/drizzle/schema";
import { IUser } from "./user.schema";
import { hashPassword } from "../../utils/security";

export const createUser = async (payload: InferInsertModel<typeof users>): Promise<IUser> => {
  const userExist = await db.query.users.findFirst({
    where: eq(users.username, payload.username),
  });

  if (userExist) {
    throw new Error("User with same email address already exist");
  }

  const password = await hashPassword(payload.password);

  const user = await db
    .insert(users)
    .values({ ...payload, password: password })
    .returning()
    .execute();

  return user[0];
};

export const fetchUsers = async (): Promise<IUser[]> => {
  const users = await db.query.users.findMany();

  return users;
};

export const fetchUser = async (userId: string): Promise<IUser> => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, Number(userId)),
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const findUserById = async (userId: number): Promise<IUser | null> => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  return user || null;
};

export const findUserByEmail = async (email: string): Promise<IUser> => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const findUserByUsername = async (username: string): Promise<IUser | null> => {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  return user || null;
};
