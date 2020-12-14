class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Message is the only parameter accepter by the Error class

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // when a new object is created and the constructor is called, that functions call will not appear in the stacktrace and will not pollute it.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
