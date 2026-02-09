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
      unique: true,
      trim: true
    },
    
    status: {
      type: String,
      enum: ["PROVISIONING", "READY", "FAILED", "DELETING"],
      default: "PROVISIONING",
    },

    owner: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    link : {
      type : String
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Store", storeSchema);
