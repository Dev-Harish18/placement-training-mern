class AppError {
  constructor(code, message) {
    this.message = message;
    this.statusCode = code;
    this.status = "fail";
    this.isOperational = true;
  }
}

module.exports = AppError;
