import { z } from "zod";

const createArticleSchema = (editing = false) => {
  return z.object({
    id: z.number().optional(),
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
  });
};

export { createArticleSchema };

