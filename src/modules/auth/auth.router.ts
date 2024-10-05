import { FastifyInstance } from "fastify";
import { getGithubOAuthUrl, handleGithubRedirect } from "./auth.service";

const authRouter = async (fastify: FastifyInstance, _: { prefix: string }, done: () => void ) => {
  fastify.get(`/github`, async (_, reply) => {
    const githubAuthUrl = getGithubOAuthUrl();
    return reply.redirect(githubAuthUrl);
  });

  fastify.get(`/github/callback`, async (request, reply) => {
    const { code } = request.query as { code: string };

    const { token, user } = await handleGithubRedirect(code);

    return reply.send({ token, user });
  });

  done();
};

export default authRouter;
