import { z } from "zod";

const configSchema = z.object({
  POSTGRES_DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  PORT: z.string().default("3000").transform(Number),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
});

const jwtConfigSchema = z.object({
  JWT_SECRET: z.string(),
});

export const jwtConfig = jwtConfigSchema.parse(process.env);

export default configSchema.parse(process.env);
