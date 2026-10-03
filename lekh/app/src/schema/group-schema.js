import { z } from "zod";

const createGroupSchema = (editing = false) => {
  return z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Name is required"),
    description: z.string(),
    knownIssues: z.string(),
  });
};

export { createGroupSchema };

