// Diffs in the link below are ChatGPT assisted
// https://github.com/dipt-pa1493-ht26/pa1493-tewa25-lekh-zda/pull/181/changes

import { z } from "zod";

const reservationSchema = z.object({
  itemId: z.number().int().positive(),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  reservationType: z.enum(["book", "borrow"]),
}).refine(
  (data) =>
    !Number.isNaN(data.startAt.getTime()) &&
    !Number.isNaN(data.endAt.getTime()) &&
    data.endAt > data.startAt,
  {
    message: "End date must be after start date",
    path: ["endAt"],
  }
).refine(
  (data) => {
    const duration = data.endAt.getTime() - data.startAt.getTime();

    if (data.reservationType === "book") {
      return duration <= 24 * 60 * 60 * 1000;
    }

    const days = duration / (24 * 60 * 60 * 1000);
    return days >= 1 && days <= 7;
  },
  {
    message: "Invalid reservation duration",
    path: ["endAt"],
  }
);

export { reservationSchema };

