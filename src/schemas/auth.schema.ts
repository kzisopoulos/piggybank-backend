import { z } from "zod";

export const registerSchema = z.object({
  email: z.email({ error: "Email is required." }),
  username: z
    .string({ error: "Username is requred" })
    .min(2, { error: "Username must be at least 2 characters long" }),
  password: z
    .string({ error: "Password is required." })
    .min(5, { error: "Password must be at least 5 characters long." }),
});

export const loginSchema = z.object({
  email: z.email({ error: "Email is required." }),
  password: z
    .string({ error: "Password is required." })
    .min(5, { error: "Password must be at least 5 characters long." }),
});
