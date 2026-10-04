import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const createItemSchema = (groups, statuses, editing = false) => {
  const statusIds = statuses.map((status) => status.id);
  const groupIds = groups.map((group) => group.id);

  const imageSchema = z.instanceof(File)
    .refine(
      (file) => file.size <= MAX_IMAGE_SIZE,
      "Image must be smaller than 5MB."
    )
    .refine(
      (file) => file.type.startsWith("image/"),
      "File must be an image."
    );

  return z.object({
    id: z.number().optional(),
    assetId: z.number().optional(),
    name: z.string().min(1, "Name is required"),
    description: z.string(),
    knownIssues: z.string(),
    shelf: z.string(),
    serial: z.string().min(1, "Serial is required"),

    statusId: z.number().refine(
      (id) => statusIds.includes(id),
      "Invalid status"
    ),

    groupId: z.number().refine(
      (id) => groupIds.includes(id),
      "Invalid group"
    ),

    image: editing
      ? imageSchema.optional()
      : imageSchema
  });
};

export { createItemSchema };

