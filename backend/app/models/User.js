import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  name: String,
  avatar: String,
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
