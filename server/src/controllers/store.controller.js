import Store from '../models/store.model.js';
import crypto from "crypto";
import { createK8sNamespace, deleteStoreResources, deployStoreHelmChart, executeHelmCommand } from '../services/k8sServices.js';
import { getStoreAdminUrl, getStoreDomain } from '../utils/helper.js';
import { MAX_STORE_FREE_LIMIT, PROHIBITED_SLUG } from '../utils/constant.js';
import { PROTOCOL } from '../config/env.js';
import { getMedusaStoreCommand } from '../utils/commands.js';




export const createStore = async (req, res) => {
  try {
    const { name, storeType, slug, adminEmail, adminPassword } = req.body; 
    const userId = req.user.userId;
    const currentStoreCount = await Store.countDocuments({ owner: userId });
    
    if (currentStoreCount >= MAX_STORE_FREE_LIMIT) {
      return res.status(403).json({
        success: false,
        message: `Quota Exceeded: You can only create up to ${MAX_STORE_FREE_LIMIT} stores.`
      });
    }

    if (!name || !storeType) {
      return res.status(400).json({
        success: false,
        message: "Name and storeType are required",
      });
    }

    if (!["woocommerce", "medusa"].includes(storeType)) {
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
    
    if (existingStore || PROHIBITED_SLUG.includes(slug)) {
      return res.status(400).json({ 
        success: false, 
        message: `Domain '${domain}' is already taken. Please choose another one.` 
      });
    }
    
    const store = await Store.create({
      name,
      storeType,
      slug,
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
        await deployStoreHelmChart(namespace, name, storeType, domain, adminEmail, adminPassword,slug);
        await Store.findByIdAndUpdate(store._id, {
          status: storeType === "medusa" ? "BACKEND_READY" : "READY",
          storeUrl: `${PROTOCOL}${domain}`,
          adminUrl : getStoreAdminUrl(storeType, slug)
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
    //! todo check if owner 
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



export const deployStorefront = async (req, res) => {
    try {
        const { storeId, publishableKey } = req.body;
        if (!storeId || !publishableKey) {
            return res.status(400).json({
                success: false,
                error: "Validation Error",
                message: "Missing required parameters: 'storeId' and 'publishableKey' are mandatory."
            });
        }

        const store = await Store.findById(storeId);

        if (!store) {
            return res.status(404).json({
                success: false,
                error: "Resource Not Found",
                message: "The requested store identifier does not exist in our records."
            });
        }

        if (store.storeType !== 'medusa') {
            return res.status(422).json({
                success: false,
                error: "Invalid Platform Configuration",
                message: "Operation aborted: The targeted store is not initialized as a Medusa Commerce instance."
            });
        }

        if (!store.namespace || !store.slug || store.status !== "BACKEND_READY" || store.status !== "READY") {
            return res.status(409).json({
                success: false,
                error: "Pre-requisite Failed",
                message: "Backend infrastructure (Phase 1) is missing. Please deploy the Admin/API layer first."
            });
        }

        store.status = "DEPLOYING_FRONTEND";
        await store.save();

        res.status(202).json({
            success: true,
            message: "Storefront deployment initiated in background.",
            storeId: storeId
        });

        (async () => {
            try {
                console.log(`[Background] Starting Storefront for: ${store.slug}...`);
                
                const namespace = store.namespace;
                const slug = store.slug;
                const domain = store.domain;
                const backendUrl = `${PROTOCOL}api-${domain}`; 

                const command = getMedusaStoreCommand(namespace,slug,domain,backendUrl, publishableKey);
                
                await executeHelmCommand(command);

                await Store.findByIdAndUpdate(storeId, { 
                    status: "READY", 
                    updatedAt: new Date() 
                });
                
                console.log(`[Background] Storefront ${slug} is now READY! ✅`);

            } catch (err) {
                console.error(`[Background] Deployment Failed for ${store.slug}:`, err);
                
                await Store.findByIdAndUpdate(storeId, {
                    status: "FAILED",
                    failureReason: err.message
                });
            }
        })();

    } catch (error) {
        console.error("API Error:", error);
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: "Failed to start deployment",
                error: error.message
            });
        }
    }
};
