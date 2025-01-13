const firebaseLogger = require("firebase-functions/logger");

const SENSITIVE_FIELDS = ["password", "authorization"];

/**
 * Sanitizes sensitive data fields by replacing their values with asterisks.
 * 
 * @param {Object} data - The object to sanitize.
 * @returns {Object} A sanitized copy of the object.
 */
const sanitizeData = (data) => {
    const sanitized = { ...data };
    SENSITIVE_FIELDS.forEach((field) => {
        if (sanitized[field]) sanitized[field] = '***';
    });
    return sanitized;
};

/**
 * Logger utility for handling logging of requests, responses, errors, and custom messages.
 */
const logger = {
    /**
     * Logs details of an incoming request.
     * 
     * @param {Object} req - The HTTP request object.
     * @param {string} req.method - The HTTP method (e.g., GET, POST).
     * @param {string} req.originalUrl - The original URL of the request.
     * @param {Object} req.body - The body of the request.
     * @param {Object} req.query - The query parameters of the request.
     * @param {Object} req.headers - The headers of the request.
     */
    logRequest: (req) => {
        const { method, originalUrl, body, query, headers } = req;
        firebaseLogger.info("Request received", {
            method,
            url: originalUrl,
            body: sanitizeData(body),
            query: sanitizeData(query),
            headers: sanitizeData(headers),
        });
    },

    /**
     * Logs details of a successful response.
     * 
     * @param {Object} req - The HTTP request object.
     * @param {Object} res - The HTTP response object.
     * @param {string} req.method - The HTTP method (e.g., GET, POST).
     * @param {string} req.originalUrl - The original URL of the request.
     */
    logSuccessResponse: (req, res) => {
        const { method, originalUrl } = req;
        firebaseLogger.info("Response sent", {
            method,
            url: originalUrl
        });
    },

    /**
     * Logs details of an error thrown during request handling.
     * 
     * @param {Object} req - The HTTP request object.
     * @param {Error} thrownError - The error object that was thrown.
     * @param {string} req.method - The HTTP method (e.g., GET, POST).
     * @param {string} req.originalUrl - The original URL of the request.
     * @param {string} thrownError.message - The error message.
     * @param {string} [thrownError.stack] - The stack trace of the error.
     * @param {number} [thrownError.statusCode=500] - The HTTP status code associated with the error.
     * @param {string} [thrownError.logLevel='error'] - The log level for the error.
     */
    logError: (req, thrownError) => {
        const { method, originalUrl } = req;
        const logMessage = {
            method,
            url: originalUrl,
            error: thrownError.message,
            stack: thrownError.stack,
            statusCode: thrownError.statusCode || 500,
        };
        const logLevel = thrownError.logLevel || 'error';
        firebaseLogger[logLevel]("Handled error", logMessage);
    },

    /**
     * Logs a custom message.
     * @param {string} [message] - The message.
     * */
    logInfo: (message) => {
        firebaseLogger.info(message)
    },

    /**
     * Logs a warning.
     * @param {string} [message] - The message.
     * */
    logWarn: (message) => {
        firebaseLogger.warn(message)
    },
}

module.exports = logger;