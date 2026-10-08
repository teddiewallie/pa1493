import { z } from "zod";

const reservationSchema = z.object({
  itemId: z.number().int().positive(),
  startAt: z.date(),
  endAt: z.date(),
  isPending: z.boolean()
}).refine(
  (data) => data.endAt > data.startAt,
  {
    message: "End date must be after start date",
    path: ["endAt"]
  }
);

export { reservationSchema };

