const { errorLogger } = require("../utils/logger");

const errorLoggerMiddleware = (err, req, res, next) => {
  errorLogger.error({
    message: err.message,
    statusCode: err.statusCode || 500,
    time: new Date().toISOString(),
  });

  next(err);
};

module.exports = errorLoggerMiddleware;