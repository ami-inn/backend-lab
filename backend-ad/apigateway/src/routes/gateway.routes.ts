import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

import config from "@/config";

const router = Router();

router.use(
  "/auth",
  createProxyMiddleware({
    target: config.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/auth": "/api/v1/auth" },
  }),
);

router.use(
  "/user",
  createProxyMiddleware({
    target: config.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/user": "/api/v1/user" },
  }),
);

router.use(
  "/payment",
  createProxyMiddleware({
    target: config.PAYMENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/payment": "/api/v1/payment" },
  }),
);

router.use(
  "/search",
  createProxyMiddleware({
    target: config.SEARCH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/search": "/api/v1/search" },
  }),
);

router.use(
  "/booking",
  createProxyMiddleware({
    target: config.BOOKING_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/booking": "/api/v1/booking" },
  }),
);

router.use(
  "/notifications",
  createProxyMiddleware({
    target: config.NOTIFICATION_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/notifications": "/api/v1/notifications" },
  }),
);

export default router;