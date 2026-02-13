import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    storeType: {
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
    slug : {
      type : String,
      required : true,
    },

    status: {
      type: String,
      enum: ["PROVISIONING", "READY", "FAILED", "DELETING", "DELETION_FAILED", "BACKEND_READY","DEPLOYING_FRONTEND"],
      default: "PROVISIONING",
    },   

    storeUrl : { type : String }, 
    adminUrl : { type : String },

    adminEmail : {
      type : String,
      required: true
    }, 
    adminPassword : {
      type : String, 
      required : true,
    },
    
    owner: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    customDomain: { type: String, default: null },
    domainValidationToken: { type: String },
    domainStatus: { 
      type: String, 
      enum: ['NONE', 'PENDING_VALIDATION', 'VALIDATED', 'ACTIVE'], 
      default: 'NONE' 
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Store", storeSchema);
