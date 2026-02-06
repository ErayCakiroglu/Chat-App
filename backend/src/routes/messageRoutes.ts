import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { getMessages } from "../controllers/messageController";

const router = Router();

// Belirli bir sohbet ID'sine ait mesajları getir
router.get("/chat/:chatId", protectRoute, getMessages);

export default router;