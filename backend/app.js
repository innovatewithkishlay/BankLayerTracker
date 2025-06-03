require("dotenv").config();
const express = require("express");
const { helmet, limiter, cors, corsOptions } = require("./config/security");
const connectDB = require("./config/db");
const caseRoutes = require("./app/routes/caseRoutes");
const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(limiter);
app.use(express.json());

// Database
connectDB();

// Routes
app.use("/api/cases", caseRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
