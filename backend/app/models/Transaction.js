const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  fromAccount: { type: String, required: true },
  toAccount: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case" },
  isSuspicious: { type: Boolean, default: false },
  metadata: {
    ipCountry: { type: String },
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
