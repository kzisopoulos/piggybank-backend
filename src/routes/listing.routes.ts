import { Router } from "express";
import {
  createListing,
  deleteListing,
  getListings,
  updateListing,
} from "../controllers/listing.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getListings);
router.post("/", protect, createListing);
router.patch("/", protect, updateListing);
router.delete("/", protect, deleteListing);

export default router;
