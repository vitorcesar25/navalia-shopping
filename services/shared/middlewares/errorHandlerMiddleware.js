const {CustomError} = require("../errors/CustomErrors");
const {logError, logRequest, logSuccessResponse} = require("../utils/logger");
/**
 * Middleware to handle errors in asynchronous routes.
 * Recognizes custom errors and responds with the appropriate status code.
 *
 * @param {Function} fn - The asynchronous route handler function.
 * @return {Function} A wrapped route handler with error handling.
 */
const errorHandlerMiddleware = (fn) => {
  return async (req, res, next) => {
    logRequest(req);
    try {
      await fn(req, res, next);
      logSuccessResponse(req, res);
    } catch (error) {
      logError(req, error);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({message: error.message});
      } else {
        res.status(500).json({error: "Internal server error"});
      }
    }
  };
};

module.exports = errorHandlerMiddleware;
