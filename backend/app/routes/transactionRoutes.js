const express = require("express");
const router = express.Router();
const {
  getTransaction,
  flagTransaction,
} = require("../controllers/transactionController");

router.get("/:transactionId", getTransaction);
router.patch("/:transactionId/flag", flagTransaction);

module.exports = router;
