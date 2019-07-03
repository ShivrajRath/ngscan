import Hapi from "@hapi/hapi";
import QueryHandler from "./query-handler";
import { environment } from "./environment/environment";
import * as log4js from "log4js";

log4js.configure({
  appenders: { ngscan: { type: "file", filename: "trace.log" } },
  categories: {
    default: { appenders: ["ngscan"], level: environment.logLevel }
  }
});
const logger = log4js.getLogger();
logger.level = environment.logLevel;

const init = async () => {
  const server = Hapi.server({
    port: environment.port,
    host: environment.host
  });

  // API routes
  server.route({
    method: "GET",
    path: "/ng/{ingredient}",
    handler: async (request, reply) =>
      await QueryHandler.getIngredientSummary(request, reply)
  });

  // 404 default
  server.route({
    method: "*",
    path: "/{any*}",
    handler: QueryHandler.notfound
  });

  await server.start();
  logger.info("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", err => {
  logger.error(err);
  process.exit(1);
});

init();
