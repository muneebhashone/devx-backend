import Fastify, { FastifyInstance } from "fastify";
import mercurius from "mercurius";
import cors from "@fastify/cors";
import schema from "../graphqlSchemaBuilder";
import { contextHandler } from "./contextHandler";

const app: FastifyInstance = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      level: "info",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
});

app.register(mercurius, {
  schema: schema,
  graphiql: true,
  context: contextHandler,
});

app.register(cors, {
  delegator: (_, callback) => {
    callback(null, { origin: ["https://studio.apollographql.com"] });
  },
});

export default app;
