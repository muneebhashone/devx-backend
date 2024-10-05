import { FastifyRequest } from "fastify";
import { verifyJwt } from "../utils/security";

export async function contextHandler(request: FastifyRequest) {
  try {
    const { headers } = request;
    const authorization = headers.authorization;

    if (!authorization) {
      return {
        currentUser: null,
      };
    }

    const currentUser = await verifyJwt(authorization.split(" ")[1]);

    return { currentUser };
  } catch (_) {
    return { currentUser: null };
  }
}