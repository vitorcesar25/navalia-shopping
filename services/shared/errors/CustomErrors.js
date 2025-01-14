/**
 * Base class for custom errors.
 * Extends the built-in Error class to include additional information such as status code and log level.
 */
class CustomError extends Error {
    /**
     * @param {string} message - The error message.
     * @param {number} statusCode - The HTTP status code associated with the error.
     * @param {string} [logLevel='error'] - The log level for this error (e.g., 'info', 'warn', 'error').
     */
    constructor(message, statusCode, logLevel = 'error') {
        super(message);
        this.statusCode = statusCode;
        this.logLevel = logLevel;
    }
}

/**
 * Represents a "Bad Request" error (HTTP 400).
 */
class BadRequestError extends CustomError {
    /**
     * @param {string} [message='Bad Request'] - The error message.
     */
    constructor(message = 'Bad Request') {
        super(message, 400, 'warn');
    }
}

/**
 * Represents an "Unauthorized" error (HTTP 401).
 */
class UnauthorizedError extends CustomError {
    /**
     * @param {string} [message='Unauthorized'] - The error message.
     */
    constructor(message = 'Unauthorized') {
        super(message, 401, 'warn');
    }
}

/**
 * Represents a "Not Found" error (HTTP 404).
 */
class NotFoundError extends CustomError {
    /**
     * @param {string} [message='Not Found'] - The error message.
     */
    constructor(message = 'Not Found') {
        super(message, 404, 'info');
    }
}

/**
 * Represents a "Conflict" error (HTTP 409).
 */
class ConflictError extends CustomError {
    /**
     * @param {string} [message='Conflict'] - The error message.
     */
    constructor(message = 'Conflict') {
        super(message, 409, 'warn');
    }
}

/**
 * Represents an "Internal Server Error" (HTTP 500).
 */
class InternalServerError extends CustomError {
    /**
     * @param {string} [message='Internal Server Error'] - The error message.
     */
    constructor(message = 'Internal Server Error') {
        super(message, 500, 'error');
    }
}

/**
 * Represents an "Unprocessable Entity" error (HTTP 422).
 */
class UnprocessableEntityError extends CustomError {
    constructor(message = 'Unprocessable Entity') {
        super(message, 422, 'warn');
    }
}

module.exports = {
    CustomError,
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
    ConflictError,
    InternalServerError,
    UnprocessableEntityError
};