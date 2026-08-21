import express from "express";

import { getProfile } from "@/controllers/user.controller";
import { requireAuth } from "@/middlewares/auth.middleware";



const router = express.Router();

router.get("/profile", requireAuth, getProfile);

export default router;