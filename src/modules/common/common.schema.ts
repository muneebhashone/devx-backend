import { z } from "zod";
import { builder } from "../../builder";
import { MediaTypeGraphQLEnum } from "../../enums";

export const Media = builder
  .objectRef<{ url: string; type: string }>("Media")
  .implement({
    fields: (t) => ({
      url: t.exposeString("url"),
      type: t.exposeString("type"),
    }),
  });

// Define the MediaInput type
export const MediaInput = builder.inputType("MediaInput", {
  fields: (t) => ({
    url: t.string({ required: true, validate: { schema: z.string().url() } }),
    type: t.field({ required: true, type: MediaTypeGraphQLEnum }),
  }),
});
