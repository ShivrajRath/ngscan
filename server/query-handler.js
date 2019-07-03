/**
 * Handler for HTTP queries
 */
import * as log4js from "log4js";

const logger = log4js.getLogger();

export const HTTP_CODES = {
  NOT_FOUND: { code: 404, message: "Page Not Found" },
  ISE: { code: 500, message: "OOPS!!! Something went wrong" }
};

export default class QueryHandler {
  static async getIngredientSummary(request, reply) {
    try {
      logger.info("query handler for request", request);
      return reply.response("works");
    } catch (err) {
      logger.error(err);
      return reply.response(HTTP_CODES.ISE.message).code(HTTP_CODES.ISE.code);
    }
  }

  static notfound(request, reply) {
    return reply
      .response(HTTP_CODES.NOT_FOUND.message)
      .code(HTTP_CODES.NOT_FOUND.code);
  }
}
