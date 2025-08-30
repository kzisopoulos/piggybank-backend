import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.controller";
import {
  getSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "../controllers/subcategory.controller";

const router = Router();

// Category routes
router.get("/", getCategories);
router.post("/", createCategory);
router.patch("/", updateCategory);
router.delete("/", deleteCategory);

// Subcategory routes
router.get("/subcategories", getSubcategories);
router.post("/subcategories", createSubcategory);
router.patch("/subcategories", updateSubcategory);
router.delete("/subcategories", deleteSubcategory);

export default router;
