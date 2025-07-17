const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_url: { type: String, required: true, unique: true },
  // preferred_domain: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  user_uid: { type: String, default: null },
});

module.exports = mongoose.model("Url", urlSchema);
