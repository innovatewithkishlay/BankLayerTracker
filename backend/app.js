require("dotenv").config();
const express = require("express");
const { helmet, limiter, cors, corsOptions } = require("./config/security");
const connectDB = require("./config/db");
const caseRoutes = require("./app/routes/caseRoutes");
const transactionRoutes = require("./app/routes/transactionRoutes");
const authRoutes = require("./app/routes/auth");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    ...corsOptions,
    credentials: true,
  })
);
app.use(limiter);
app.use(express.json());
app.use(cookieParser());

//Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, //i need to updated this later
    },
  })
);

// Passport & Authentication
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

// Database Connection
connectDB();

// Routes
app.use("/api/cases", caseRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/auth", authRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({ status: "API Operational", timestamp: new Date() });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(" Error:", err.stack);
  res.status(err.status || 500).json({
    error:
      process.env.NODE_ENV === "development" ? err.message : "Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Secure server running on port ${PORT}`));
