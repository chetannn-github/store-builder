import { v4 as uuid } from "uuid";
import Store from "../models/store.model.js";
import { enqueueProvision } from "../services/store.service.js";
import { deleteNamespace } from "../services/k8s.service.js";

export const createStore = async (req, res) => {
  const storeId = uuid();

  const store = await Store.create({
    storeId,
    namespace: `store-${storeId}`,
    status: "REQUESTED"
  });

  enqueueProvision(store.storeId);

  res.status(202).json(store);
};

export const listStores = async (req, res) => {
  const stores = await Store.find().sort({ createdAt: -1 });
  res.json(stores);
};



export const deleteStore = async (req, res) => {
  const { storeId } = req.params;

  const store = await Store.findOne({ storeId });
  if (!store) return res.status(404).send();

  await Store.updateOne(
    { storeId },
    { status: "DELETING" }
  );

  
  deleteNamespace(store.namespace)
    .then(() => Store.deleteOne({ storeId }))
    .catch(console.error);

  res.status(202).send();
};
