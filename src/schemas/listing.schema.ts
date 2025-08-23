import { z } from "zod";

export const createListingSchema = z.object({
  title: z.string({
    message: "Title is required",
  }),
  priceCents: z
    .number({
      message: "Price is required",
    })
    .int()
    .positive(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  stock: z.number().int().min(0).optional(),
  categoryId: z.string().optional(),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        alt: z.string().optional(),
        isMain: z.boolean().optional(),
      })
    )
    .optional(),
  mainImage: z.string().url().optional(),
  isActive: z.boolean().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const deleteListingSchema = z.object({
  listingId: z.string(),
});

export const updateListingSchema = createListingSchema.partial().extend({
  listingId: z.string(),
});
