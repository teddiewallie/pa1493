import { z } from "zod";

const createUserSchema = (editing) => z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.email(),
  password: editing
    ? z.string().refine(
      (value) => value === "" || value.length >= 4,
      "Password must be at least 4 characters"
    )
    : z.string().min(4, "Password must be at least 4 characters"),
  maintainer: z.boolean()
});

export { createUserSchema };

