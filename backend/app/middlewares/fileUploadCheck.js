module.exports = (req, res, next) => {
  console.log("Uploaded file info:", req.file);
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "No file uploaded or wrong field name!" });
  }
  next();
};
