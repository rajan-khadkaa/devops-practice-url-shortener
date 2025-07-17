const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  profileImage: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
  },
  emailVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
