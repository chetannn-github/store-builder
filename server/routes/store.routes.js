import { Router } from "express";
import {
  createStore,
  listStores,
  deleteStore
} from "../controllers/store.controller.js";

const router = Router();

router.post("/", createStore);
router.get("/", listStores);
router.delete("/:storeId", deleteStore);

export default router;