import express from "express";
import { getAISuggestedTasks, getChatHistory, processAIChat } from "../controllers/ai.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/chat/:storeId", authenticate, getChatHistory);
router.post("/chat",authenticate, processAIChat);
router.get("/suggestions/:storeId",authenticate, getAISuggestedTasks);

export default router;