import { z } from "zod";

export default z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email(),
  password: z.string().min(4, "Password must be at least 4 characters"),
  maintainer: z.boolean()
});

