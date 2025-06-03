const express = require("express");
const router = express.Router();
const { processSingleCase } = require("../controllers/caseController");
const upload = require("../../config/multer");

// (Plug-in Engine)

router.post("/upload/plugin", upload.single("csvFile"), processSingleCase);

module.exports = router;
