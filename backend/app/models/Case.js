const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
  {
    caseId: { type: String, required: true, unique: true },
    description: String,
    accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }],
    transactions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    ],
    linkedCases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Case" }],
    anomalies: {
      highValue: [
        {
          transaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction",
          },
          amount: Number,
          date: Date,
        },
      ],
      structuring: [
        {
          account: String,
          count: Number,
          totalAmount: Number,
        },
      ],
      circular: [
        {
          path: [String],
          totalAmount: Number,
          transactions: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
          ],
        },
      ],
      geographic: [
        {
          account: String,
          country: String,
          transactionCount: Number,
        },
      ],
    },
    metadataPatterns: {
      commonEmails: [String],
      commonPhones: [String],
      commonIPs: [String],
    },
  },
  { timestamps: true }
); // Adds createdAt/updatedAt fields

module.exports = mongoose.model("Case", caseSchema);
