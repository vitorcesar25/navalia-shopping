const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const {UnauthorizedError} = require("../errors/CustomErrors");

const unauthorizedResponseFormater = (req, res, error) => {
  logger.logError(req, error);
  return res.status(401).json({error: "Authorization error"});
};


/**
 * Middleware to authenticate incoming requests using a JSON Web Token (JWT).
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 *
 * @return {Object} 401 response if authentication fails.
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      throw new UnauthorizedError("Authorization header is missing");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("Token is missing.");
    }
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);

    req.user = decoded;

    next();
  } catch (err) {
    return unauthorizedResponseFormater(req, res, err);
  }
};

module.exports = authMiddleware;
