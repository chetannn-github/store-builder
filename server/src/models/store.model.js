import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["woocommerce", "medusa"],
      required: true,
    },

    namespace: {
      type: String,
      required: true,
      unique: true,
    },

    domain: {
      type: String,
      required: true,
    },
    
    isCustomDomain: { 
      type: Boolean, 
      default: false 
    },
    status: {
      type: String,
      enum: ["PROVISIONING", "READY", "FAILED", "DELETING"],
      default: "PROVISIONING",
    },

    failureReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Store", storeSchema);
