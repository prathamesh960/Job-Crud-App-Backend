const mongoose = require("mongoose");
mongoose.pluralize(null);

const addJobSchema = new mongoose.Schema({
  title: String,
  content: String,
  status: String,
});


module.exports = mongoose.model("addjob", addJobSchema);
