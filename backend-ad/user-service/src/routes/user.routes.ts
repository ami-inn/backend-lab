import express from "express";

import { getProfile, updateProfile, deleteProfile } from "@/controllers/user.controller";
// import { requireAuth } from "@/middlewares/auth.middleware";
import { getUserContext } from "@/middlewares/getUserContext.middleware";



const router = express.Router();

router.get("/profile", getUserContext, getProfile);
// router.get("/profile", async (req, res) => {
//     return res.status(200).json({ success: true, message: "User profile fetched successfully", data: req.user });
// })

router.put("/profile", getUserContext, updateProfile);
router.delete("/profile", getUserContext, deleteProfile);

export default router;