import { z } from "zod";

export const createAccountSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  type: z.string().optional(),
  currency: z.string().optional(),
  balance: z.number().min(0, "Balance must be non-negative").optional(),
});

export const deleteAccountSchema = z.object({
  id: z.string(),
});

export const updateAccountSchema = createAccountSchema.partial().extend({
  id: z.string(),
});
