import express from "express";
import { signup, login, me } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/me", authenticate, me)
router.post("/signup", signup);
router.post("/login", login);

export default router;