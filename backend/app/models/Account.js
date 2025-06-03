const mongoose = require("mongoose");
const accountSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true, unique: true },
  accountHolder: { type: String, required: true },
  accountType: { type: String, enum: ["personal", "business"], required: true },
  metadata: {
    mobile: { type: String },
    ipAddress: { type: String },
    email: { type: String },
  },
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case" },
  isFlagged: { type: Boolean, default: false },
});

module.exports = mongoose.model("Account", accountSchema);
