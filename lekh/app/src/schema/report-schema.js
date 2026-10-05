import { z } from "zod";

const reportSchema = z.object({
  id: z.number(),
  reportIssue: z.string(),
  knownIssues: z.string()
});

export { reportSchema };

