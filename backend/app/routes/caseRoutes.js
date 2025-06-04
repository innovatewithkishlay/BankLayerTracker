const express = require("express");
const router = express.Router();
const {
  processSingleCase,
  getAllCases,
  getCaseById,
  deleteCase,
  getCaseTransactions,
  getCaseAnomalies,
} = require("../controllers/caseController");
const fileUploadCheck = require("../middlewares/fileUploadCheck");
const upload = require("../../config/multer");

// CSV Upload
router.post(
  "/upload/plugin",
  upload.single("csvFile"),
  fileUploadCheck,
  processSingleCase
);

// Case Management
router.get("/", getAllCases);
router.get("/:caseId", getCaseById);
router.delete("/:caseId", deleteCase);

// Transaction Data
router.get("/:caseId/transactions", getCaseTransactions);

// Anomaly Detection Results
router.get("/:caseId/anomalies", getCaseAnomalies);

module.exports = router;
