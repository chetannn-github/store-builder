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
        message: `Quota Exceeded: You can only create up to ${MAX_STORE_LIMIT} stores on the free plan.`
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

    if(type === 'medusa' && (!adminEmail || !adminPassword)) {
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
    });

    console.log("--- Starting Provisioning ---");
    
    await createK8sNamespace(namespace);
    await deployStoreHelmChart(namespace, name, type, domain,adminEmail,adminPassword);

    store.status = "READY";
    store.link = `http://${domain}`
    await store.save();
    console.log("--- Store Ready ---");

    return res.status(201).json({
      success: true,
      message: "Store created successfully",
      data: store
    });
   
  } catch (error) {
    console.error("Error creating store:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Namespace conflict, please retry",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create store",
    });
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

    await deleteStoreResources(store.namespace);
    await Store.findByIdAndDelete(storeId);

    console.log("--- Store Deleted Successfully ---");

    return res.status(200).json({
      success: true,
      message: "Store deleted successfully",
    });

  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete store",
      error: error.message
    });
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