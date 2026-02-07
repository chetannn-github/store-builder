import Store from '../models/store.model.js';
import crypto from "crypto";
import { createK8sNamespace, deleteStoreResources, deployStoreHelmChart } from '../services/k8sServices.js';
import { getStoreDomain } from '../utils/helper.js';



export const createStore = async (req, res) => {
  try {
    const { name, type, customDomain } = req.body; 

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
    const suffix = crypto.randomBytes(3).toString("hex");
    const namespace = `store-${suffix}`;
    const { domain, isCustom}  = getStoreDomain(namespace,customDomain);

    const store = await Store.create({
      name,
      type,
      namespace,
      domain, 
      isCustomDomain: isCustom,
      status: "PROVISIONING",
    });

    console.log("--- Starting Provisioning ---");
    
    await createK8sNamespace(namespace);
    await deployStoreHelmChart(namespace, name, type, domain);

    store.status = "READY";
    await store.save();

    console.log("--- Store Ready ---");

    return res.status(201).json({
      success: true,
      message: "Store created successfully",
      data: store,
      storeUrl: `http://${domain}`
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
    const { id } = req.params;
    const store = await Store.findById(id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    store.status = "DELETING";
    await store.save();

    await deleteStoreResources(store.namespace);
    await Store.findByIdAndDelete(id);

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
