import { FastifyInstance } from "fastify";
import config from "../../core/config";
import { handleGithubRedirect } from "./auth.service";

const GITHUB_CLIENT_ID = config.GITHUB_CLIENT_ID;

const authRouter = async (fastify: FastifyInstance, _: { prefix: string }, done: () => void ) => {


  fastify.get(`/github`, async (_, reply) => {
    const scopes = ["user:email", "read:user"];
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=${scopes.join(
      " "
    )}`;
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
