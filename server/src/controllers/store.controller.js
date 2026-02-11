import Store from '../models/store.model.js';
import crypto from "crypto";
import { createK8sNamespace, deleteStoreResources, deployStoreHelmChart } from '../services/k8sServices.js';
import { getStoreDomain } from '../utils/helper.js';
import { MAX_STORE_LIMIT } from '../utils/constant.js';



export const createStore = async (req, res) => {
  try {
    const { name, type, slug, adminEmail, adminPassword } = req.body; 
    const userId = req.user.userId;
    const currentStoreCount = await Store.countDocuments({ owner: userId });
    
    if (currentStoreCount >= MAX_STORE_LIMIT) {
      return res.status(403).json({
        success: false,
        message: `Quota Exceeded: You can only create up to ${MAX_STORE_LIMIT} stores.`
      });
    }

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "Name and type are required",
      });
    }

    if (!["woocommerce", "medusa"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be either woocommerce or medusa",
      });
    }

    if(!adminEmail || !adminPassword){
      return res.status(400).json({
        success: false,
        message: "Please provide adminEmail and adminPassword !",
      });
    }

    const suffix = crypto.randomBytes(3).toString("hex");
    const namespace = `store-${suffix}`;
    const domain = getStoreDomain(namespace,slug);
    const existingStore = await Store.findOne({ domain });
    
    if (existingStore) {
      return res.status(400).json({ 
        success: false, 
        message: `Domain '${domain}' is already taken. Please choose another one.` 
      });
    }
    
    const store = await Store.create({
      name,
      type,
      namespace,
      domain, 
      status: "PROVISIONING",
      owner: userId,
      adminEmail, 
      adminPassword
    });

    res.status(202).json({
      success: true,
      message: "Store provisioning started. It will be ready in a few moments.",
    });

    (async () => {
      try {
        console.log(`[Background] Starting deployment for ${name} (${namespace})...`);
        await createK8sNamespace(namespace);
        await deployStoreHelmChart(namespace, name, type, domain, adminEmail, adminPassword);
        await Store.findByIdAndUpdate(store._id, {
          status: "READY",
          link: `http://${domain}${type === "medusa" ? "/app" : ""}`
        });

        console.log(`[Background] Store ${name} is now READY! 🟢`);

      } catch (err) {
        console.error(`[Background] Deployment Failed for ${name}:`, err);
        
        await Store.findByIdAndUpdate(store._id, {
          status: "FAILED",
          failureReason: err.message
        });
      }
    })();
  
 
  } catch (error) {
    console.error("Error creating store:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Namespace conflict, please retry",
      });
    }

    if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: "Failed to initiate store creation",
        });
    }
  }
};


export const deleteStore = async (req, res) => {
  try {
    const { storeId } = req.body;
    const store = await Store.findById(storeId);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }
    store.status = "DELETING";
    await store.save();

    res.status(202).json({
      success: true,
      message: "Store deletion initiated in background",
      storeId: storeId
    });


    (async () => {
      try {
        console.log(`[Background] Deleting resources for namespace: ${store.namespace}...`);
        await deleteStoreResources(store.namespace);
        await Store.findByIdAndDelete(storeId);
        console.log(`[Background] Store ${store.name} deleted successfully from DB & K8s ✅`);

      } catch (err) {
        console.error(`[Background] Delete Failed for ${store.name}:`, err);
        await Store.findByIdAndUpdate(storeId, {
          status: "DELETION_FAILED",
          failureReason: err.message
        });
      }
    })();

  } catch (error) {
    console.error("API Error:", error);
    if (!res.headersSent) {
        return res.status(500).json({
        success: false,
        message: "Failed to initiate deletion",
        error: error.message
        });
    }
  }
};



export const getMyStores = async (req, res) => {
  try {
    const stores = await Store.find({ owner: req.user.userId });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};