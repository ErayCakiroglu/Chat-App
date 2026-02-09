import { Router } from "express";
import { authCallback, getMe } from "../controllers/authController";
import { protectRoute } from "../middleware/auth";
import { requireAuth } from "@clerk/express";

const router = Router();

// Mevcut kullanıcı bilgilerini getir
router.get("/me", protectRoute, getMe);
// Clerk kimlik doğrulamasından sonra kullanıcıyı veritabanına kaydet/güncelle
router.post("/callback", requireAuth(), authCallback);

export default router;