import Store from "../models/store.model.js";
import { createNamespace } from "./k8s.service.js";

export const enqueueProvision = async (storeId) => {
  const store = await Store.findOne({ storeId });
  if (!store) return;

  try {
    await Store.updateOne(
      { storeId },
      { status: "PROVISIONING" }
    );

    await createNamespace(store.namespace);

    console.log("Namespace ready for", storeId);

  } catch (err) {
    await Store.updateOne(
      { storeId },
      {
        status: "FAILED",
        error: err.message
      }
    );
  }
};
