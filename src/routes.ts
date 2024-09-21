import { FastifyInstance } from "fastify";
import authRouter from "./modules/auth/auth.router";

const registerRoutes = (app: FastifyInstance) => {
  app.register(authRouter, { prefix: "/api/auth" });
};

export default registerRoutes;


