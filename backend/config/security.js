const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

// Rate limiting: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "trusted-cdn.com"],
    },
  },
});

module.exports = {
  helmet: helmetConfig,
  limiter,
  cors,
  corsOptions,
};
