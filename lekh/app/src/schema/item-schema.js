import { z } from "zod";

export default z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  serial: z.string().min(1, "Serial is required")
});

