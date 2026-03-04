import express from "express";
import {
  placeOrder,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/order.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// CUSTOMER: Place a new order
router.post("/", protectRoute, placeOrder);

// ADMIN: View all orders in the kitchen
router.get("/admin/all", protectRoute, adminRoute, getAllOrders);

// ADMIN: Update status (e.g., mark as "Out for Delivery")
router.patch("/:id/status", protectRoute, adminRoute, updateOrderStatus);

export default router;
