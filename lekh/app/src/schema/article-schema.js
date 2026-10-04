import { z } from "zod";

const createArticleSchema = () => {
  return z.object({
    id: z.number().optional(),
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    typeId: z.number().int().positive("Article type is required"),
    groupId: z.number().int().positive().nullable(),
    itemId: z.number().int().positive().nullable(),
    userId: z.number().int().positive()
  });
};

export { createArticleSchema };

