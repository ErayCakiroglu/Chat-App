import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { getUsers } from "../controllers/userController";

const router = Router();

// Kullanıcıları listeleme rotası (Sadece giriş yapmış kullanıcılar erişebilir)
router.get("/", protectRoute, getUsers);

export default router;