import { z } from "zod";

export const createSubcategorySchema = z.object({
  name: z.string().min(1, "Subcategory name is required"),
  categoryId: z.string().min(1, "Category ID is required"),
});

export const deleteSubcategorySchema = z.object({
  id: z.string(),
});

export const updateSubcategorySchema = createSubcategorySchema
  .partial()
  .extend({
    id: z.string(),
  });