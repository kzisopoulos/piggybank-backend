import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  type: z.enum(["INCOME", "EXPENSE"]),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color code")
    .optional(),
});

export const deleteCategorySchema = z.object({
  id: z.string(),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.string(),
});
