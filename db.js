import mongoose from "mongoose";
import { DB_URI } from "./config/env.js";
const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("DB running");
  } catch (error) {
    console.log(error);
  }
};
export default connectToDatabase;
