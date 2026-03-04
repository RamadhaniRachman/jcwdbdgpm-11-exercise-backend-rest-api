import { Router } from "express";
import {
  createInventory,
  getAllInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
} from "../controllers/inventory.controller.js";

const router = Router();

router.post("/", createInventory);
router.get("/", getAllInventory);
router.get("/:id", getInventoryById);
router.put("/:id", updateInventory);
router.delete("/:id", deleteInventory);

export default router;
