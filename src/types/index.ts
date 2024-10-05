import { InferSelectModel } from "drizzle-orm";
import { users } from "../models/drizzle/schema";
import { mediaTypeEnums } from "../enums";

export type User = InferSelectModel<typeof users>;
export type MediaType = (typeof mediaTypeEnums)[number];

export interface IMedia {
  url: string;
  type: MediaType;
};

