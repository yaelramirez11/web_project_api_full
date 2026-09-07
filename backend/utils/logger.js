const winston = require("winston");

// REQUEST LOG
const requestLogger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "request.log" }),
  ],
});

// ERROR LOG
const errorLogger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log" }),
  ],
});

module.exports = { requestLogger, errorLogger };