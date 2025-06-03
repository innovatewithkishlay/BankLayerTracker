const mongoose = require("mongoose");
const caseSchema = new mongoose.Schema({
  caseId: { type: String, required: true, unique: true },
  description: { type: String },
  accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }],
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  linkedCases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Case" }],
});
