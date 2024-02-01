class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.msg = message;
    this.status = `${statusCode}`.startsWith("4") ? false : true;
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
