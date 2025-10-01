import mongoose from "mongoose";
const userModel = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
});
const User = new mongoose.model("User", userModel);
export default User;
