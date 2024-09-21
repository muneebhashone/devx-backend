import app from "./core/app";
import config from "./core/config";
import { pingRedis } from "./lib/redis";
import registerRoutes from "./routes";

const start = async () => {
  try {
    await pingRedis();

    registerRoutes(app);

    await app.listen({ port: config.PORT });

    const address = app.server.address();
    const port = typeof address === "string" ? address : address?.port;

    app.log.info(`GraphiQL playground at http://localhost:${port}/graphiql`);
  } catch (err) {
    app.log.error((err as Error).message);
    process.exit(1);
  }
};

start();
