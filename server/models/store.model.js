import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    storeId: { type: String, unique: true },
    type: { type: String, enum: ["medusa"], default: "medusa" },

    status: {
      type: String,
      enum: [
        "REQUESTED",
        "PROVISIONING",
        "READY",
        "FAILED",
        "DELETING"
      ],
      default: "REQUESTED"
    },

    namespace: String,
    url: String,
    error: String
  },
  { timestamps: true }
);

export default mongoose.model("Store", storeSchema);
