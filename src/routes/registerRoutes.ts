import { FastifyInstance } from "fastify";
import authRouter from "./authRouter";

const registerRoutes = async (app: FastifyInstance) => {
  await app.register(authRouter, { prefix: "/api/auth" });
};

export default registerRoutes;


