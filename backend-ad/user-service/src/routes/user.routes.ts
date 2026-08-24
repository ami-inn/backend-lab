import express from "express";

import { getProfile, updateProfile, deleteProfile } from "@/controllers/user.controller";
// import { requireAuth } from "@/middlewares/auth.middleware";
import { getUserContext } from "@/middlewares/getUserContext.middleware";



const router = express.Router();

router.get("/profile", getUserContext, getProfile);
router.put("/profile", getUserContext, updateProfile);
router.delete("/profile", getUserContext, deleteProfile);

export default router;