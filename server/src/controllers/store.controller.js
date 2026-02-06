import Store from '../models/store.model.js';
import crypto from "crypto";
import { createK8sNamespace, deployStoreHelmChart } from '../services/k8sServices.js';



export const createStore = async (req, res) => {
  try {
    const { name, type } = req.body;

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
    const domain = `${namespace}.localhost`;

    const store = await Store.create({
      name,
      type,
      namespace,
      domain,
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

