import { describe, expect, it } from "vitest";
import { reservationSchema } from "./reservation-schema";

const validReservation = {
  itemId: 1,
  startAt: new Date("2026-10-20T10:00:00"),
  endAt: new Date("2026-10-20T12:00:00"),
  isPending: false,
};

describe("reservationSchema", () => {
  it("accepts a valid reservation", () => {
    expect(reservationSchema.safeParse(validReservation).success).toBe(true);
  });

  it("accepts a pending reservation", () => {
    expect(
      reservationSchema.safeParse({
        ...validReservation,
        isPending: true,
      }).success
    ).toBe(true);
  });

  it("rejects an end date before the start date", () => {
    const result = reservationSchema.safeParse({
      ...validReservation,
      endAt: new Date("2026-10-20T09:00:00"),
    });

    expect(result.success).toBe(false);
    expect(result.error.issues).toContainEqual(
      expect.objectContaining({
        message: "End date must be after start date",
        path: ["endAt"],
      })
    );
  });

  it("rejects equal start and end dates", () => {
    const result = reservationSchema.safeParse({
      ...validReservation,
      endAt: validReservation.startAt,
    });

    expect(result.success).toBe(false);
    expect(result.error.issues).toContainEqual(
      expect.objectContaining({
        message: "End date must be after start date",
        path: ["endAt"],
      })
    );
  });

  it("rejects zero and negative item IDs", () => {
    for (const itemId of [0, -1]) {
      expect(
        reservationSchema.safeParse({ ...validReservation, itemId }).success
      ).toBe(false);
    }
  });

  it("rejects decimal item IDs", () => {
    expect(
      reservationSchema.safeParse({
        ...validReservation,
        itemId: 1.5,
      }).success
    ).toBe(false);
  });

  it("rejects a non-numeric item ID", () => {
    expect(
      reservationSchema.safeParse({
        ...validReservation,
        itemId: "1",
      }).success
    ).toBe(false);
  });

  it.each(["startAt", "endAt"])("rejects a non-Date %s", (field) => {
    expect(
      reservationSchema.safeParse({
        ...validReservation,
        [field]: "2026-10-20T10:00:00",
      }).success
    ).toBe(false);
  });

  it("rejects missing required fields", () => {
    for (const field of ["itemId", "startAt", "endAt", "isPending"]) {
      const reservation = { ...validReservation };
      delete reservation[field];

      expect(
        reservationSchema.safeParse(reservation).success,
        `field: ${field}`
      ).toBe(false);
    }
  });

  it("rejects non-boolean isPending values", () => {
    expect(
      reservationSchema.safeParse({
        ...validReservation,
        isPending: 1,
      }).success
    ).toBe(false);
  });
});

