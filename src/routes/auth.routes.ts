// routes/auth.routes.ts
import { Router } from "express";
import { googleAuth } from "../controllers/auth/googleAuth.controller";
import { googleCallback } from "../controllers/auth/googleCallback.controller";

const router = Router();

router.get("/google", googleAuth);
router.get("/callback/google", googleCallback);

export default router;