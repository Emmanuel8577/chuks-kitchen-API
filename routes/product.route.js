import express from "express";
import {
  getProducts,
  createProduct,
} from "../controllers/product.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";


// Import your admin middleware here
const router = express.Router();

router.get("/", getProducts);
// ONLY Mr. Chuks (Admin) can add food
router.post("/", protectRoute, adminRoute, createProduct);

export default router;
