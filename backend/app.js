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
