const { requestLogger } = require("../utils/logger");

const requestLoggerMiddleware = (req, res, next) => {
  requestLogger.info({
    method: req.method,
    url: req.url,
    time: new Date().toISOString(),
  });

  next();
};

module.exports = requestLoggerMiddleware;