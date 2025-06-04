const Transaction = require("../models/Transaction");
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId);
    if (!transaction)
      return res.status(404).json({ error: "Transaction not found" });
    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};
exports.flagTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.transactionId,
      { isSuspicious: req.body.flag },
      { new: true }
    );
    if (!transaction)
      return res.status(404).json({ error: "Transaction not found" });
    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};
