import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export default z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  serial: z.string().min(1, "Serial is required"),

  image: z.instanceof(File).refine(
    (file) => file.size <= MAX_IMAGE_SIZE,
    "Image must be smaller than 5MB."
  ).refine(
    (file) => file.type.startsWith("image/"),
    "File must be an image."
  )
});

