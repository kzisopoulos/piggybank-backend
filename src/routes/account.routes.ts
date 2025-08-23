import { Router } from "express";
import {
  createAccount,
  deleteAccount,
  getAccounts,
  updateAccount,
} from "../controllers/account.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getAccounts);
router.post("/", protect, createAccount);
router.patch("/", protect, updateAccount);
router.delete("/", protect, deleteAccount);

export default router;
