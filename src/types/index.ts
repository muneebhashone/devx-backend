import { InferSelectModel } from "drizzle-orm";
import { users } from "../models/drizzle/schema";

export type User = InferSelectModel<typeof users>;