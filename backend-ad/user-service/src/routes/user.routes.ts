import express from "express";

import { getProfile, updateProfile, deleteProfile } from "@/controllers/user.controller";
import { requireAuth } from "@/middlewares/auth.middleware";



const router = express.Router();

router.get("/profile", requireAuth, getProfile);
router.put("/profile", requireAuth, updateProfile);
router.delete("/profile", requireAuth, deleteProfile);

export default router;