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

exports.getAllCases = async (req, res) => {
  try {
    const cases = await Case.find().populate("accounts transactions");
    res.status(200).json(cases);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

exports.getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.caseId).populate(
      "accounts transactions linkedCases"
    );
    if (!caseData) return res.status(404).json({ error: "Case not found" });
    res.status(200).json(caseData);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

exports.deleteCase = async (req, res) => {
  try {
    const deletedCase = await Case.findByIdAndDelete(req.params.caseId);
    if (!deletedCase) return res.status(404).json({ error: "Case not found" });

    await Account.deleteMany({ caseId: deletedCase._id });
    await Transaction.deleteMany({ caseId: deletedCase._id });

    res.status(200).json({ message: "Case deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

exports.getCaseTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ caseId: req.params.caseId });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

exports.getCaseAnomalies = async (req, res) => {
  try {
    const anomalies = await detectAnomalies(req.params.caseId);
    res.status(200).json(anomalies);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};
