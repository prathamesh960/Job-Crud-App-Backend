const mime = require("mime-types");
const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ALLOWED_FILE_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
];
const ALLOWED_PDF_TYPES = ["application/pdf"];

function validateSize(req, res, next) {
  if (!req.file) {
    return res.send({ error: "No file uploaded" });
  }
  if (req.file.size > MAX_FILE_SIZE) {
    return res.send({ error: "File size exceeds limit" });
  }
  next();
}

function validateType(req, res, next) {
  if (!req.file) {
    return res.send({ error: "No file uploaded" });
  }
  const fileType = mime.lookup(req.file.originalname);
  if (!ALLOWED_FILE_TYPES.includes(fileType)) {
    return res.send({ error: "File type not allowed" });
  }
  next();
}

function validatepdfType(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const fileType = mime.lookup(req.file.originalname);
  if (!ALLOWED_PDF_TYPES.includes(fileType)) {
    return res.status(400).json({ error: "File type not allowed" });
  }
  next();
}

module.exports = { validateSize, validateType, validatepdfType };
