import mongoose from "mongoose";
const integrationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
      enum: ["mailchimp", "getresponse"],
      index: true,
    },
    apiKey: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);
const Integration = new mongoose.model("Integration", integrationSchema);
export default Integration;
