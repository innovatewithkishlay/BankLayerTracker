const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
  },
  accountHolder: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["personal", "business"],
    required: true,
  },
  metadata: {
    mobile: { type: String },
    ipAddress: { type: String },
    email: { type: String },
  },
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
    required: true,
  },
  isFlagged: {
    type: Boolean,
    default: false,
  },
});

accountSchema.index({ accountNumber: 1, caseId: 1 }, { unique: true });

module.exports = mongoose.model("Account", accountSchema);
