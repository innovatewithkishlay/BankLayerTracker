const Case = require("../models/Case");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const parseCSV = require("../utils/csvParser");
const { detectAnomalies } = require("../utils/anomalyDetector");

exports.processSingleCase = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No CSV file uploaded" });

    const data = await parseCSV(req.file.path);

    const newCase = await Case.create({ caseId: `CASE-${Date.now()}` });

    for (const row of data) {
      const account = await Account.create({
        accountNumber: row.accountNumber,
        accountHolder: row.accountHolder,
        accountType: row.accountType,
        metadata: {
          mobile: row.mobile,
          ipAddress: row.ipAddress,
          email: row.email,
        },
        caseId: newCase._id,
      });

      const transaction = await Transaction.create({
        fromAccount: row.fromAccount,
        toAccount: row.toAccount,
        amount: row.amount,
        description: row.description,
        caseId: newCase._id,
      });

      newCase.accounts.push(account._id);
      newCase.transactions.push(transaction._id);
    }

    await newCase.save();

    const anomalies = await detectAnomalies(newCase._id);
    res.status(200).json({ case: newCase, anomalies });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};
