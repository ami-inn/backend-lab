import express from "express";

import config from "@/config";
import { requireAuth } from "@/middlewares/auth.middleware";
import { combinedRateLimit, endpointRateLimit } from "@/middlewares/rateLimit.middleware";
import { createProxy } from "@/services/proxy";

const router = express.Router();


const userServiceProxy = createProxy("userservice", config.USER_SERVICE_URL);


//public routes

router.post(
    "/users/auth/login",
    endpointRateLimit(10, 900000),
    userServiceProxy

)

router.get(
    "/users/auth/refresh",
    endpointRateLimit(10, 900000),
    userServiceProxy
)

router.post(
    "/users/auth/send-otp",
    endpointRateLimit(10, 900000),
    userServiceProxy
)

router.post(
    "/users/auth/verify-otp",
    endpointRateLimit(10, 900000),
    userServiceProxy
)

// private routes
router.get(
    "/users/user/profile",
    requireAuth,
    combinedRateLimit(),
    userServiceProxy
)

//gateway health
router.get(
    "/health",
    (_req, res) => {
        res.status(200).json({ status: "UP" });
    }
)

export default router;