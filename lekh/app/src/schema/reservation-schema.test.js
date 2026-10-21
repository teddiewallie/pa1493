// src/schema/reservation-schema.test.js

import { describe, it, expect } from "vitest";
import { reservationSchema } from "./reservation-schema";

describe("reservationSchema", () => {
  const validReservation = {
    itemId: 1,
    startAt: new Date("2026-10-20T10:00:00Z"),
    endAt: new Date("2026-10-20T11:00:00Z"),
    reservationType: "book",
  };

  describe("itemId", () => {
    it("accepts a positive integer", () => {
      expect(
        reservationSchema.safeParse(validReservation).success
      ).toBe(true);
    });

    it.each([0, -1, 1.5, NaN])("rejects itemId %s", (itemId) => {
      const result = reservationSchema.safeParse({
        ...validReservation,
        itemId,
      });

      expect(result.success).toBe(false);
    });

    it("rejects a string itemId", () => {
      const result = reservationSchema.safeParse({
        ...validReservation,
        itemId: "1",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("dates", () => {
    it("coerces valid date strings into Date objects", () => {
      const result = reservationSchema.safeParse({
        ...validReservation,
        startAt: "2026-10-20T10:00:00Z",
        endAt: "2026-10-20T11:00:00Z",
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.startAt).toBeInstanceOf(Date);
        expect(result.data.endAt).toBeInstanceOf(Date);
      }
    });

    it("rejects invalid start dates", () => {
      const result = reservationSchema.safeParse({
        ...validReservation,
        startAt: "not-a-date",
      });

      expect(result.success).toBe(false);
    });

    it("rejects invalid end dates", () => {
      const result = reservationSchema.safeParse({
        ...validReservation,
        endAt: "not-a-date",
      });

      expect(result.success).toBe(false);
    });

    it("rejects an end date before the start date", () => {
      const result = reservationSchema.safeParse({
        ...validReservation,
        startAt: new Date("2026-10-20T12:00:00Z"),
        endAt: new Date("2026-10-20T11:00:00Z"),
      });

      expect(result.success).toBe(false);
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          message: "End date must be after start date",
          path: ["endAt"],
        })
      );
    });

    it("rejects identical start and end dates", () => {
      const date = new Date("2026-10-20T10:00:00Z");

      const result = reservationSchema.safeParse({
        ...validReservation,
        startAt: date,
        endAt: date,
      });

      expect(result.success).toBe(false);
    });
  });

  describe("reservationType", () => {
    it("accepts reservation type book", () => {
      const result = reservationSchema.safeParse({
        ...validReservation,
        reservationType: "book",
      });

      expect(result.success).toBe(true);
    });

    it("accepts reservation type borrow", () => {
      const result = reservationSchema.safeParse({
        ...validReservation,
        endAt: new Date("2026-10-21T10:00:00Z"),
        reservationType: "borrow",
      });

      expect(result.success).toBe(true);
    });

    it("rejects an unsupported reservation type", () => {
      const result = reservationSchema.safeParse({
        ...validReservation,
        reservationType: "other",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("booking duration", () => {
    it("accepts a booking shorter than 24 hours", () => {
      const result = reservationSchema.safeParse({
        ...validReservation,
        startAt: new Date("2026-10-20T10:00:00Z"),
        endAt: new Date("2026-10-21T09:59:59Z"),
        reservationType: "book",
      });

      expect(result.success).toBe(true);
    });

    it("accepts a booking of exactly 24 hours", () => {
      const result = reservationSchema.safeParse({
        ...validReservation,
        startAt: new Date("2026-10-20T10:00:00Z"),
        endAt: new Date("2026-10-21T10:00:00Z"),
        reservationType: "book",
      });

      expect(result.success).toBe(true);
    });

    it("rejects a booking longer than 24 hours", () => {
      const result = reservationSchema.safeParse({
        ...validReservation,
        startAt: new Date("2026-10-20T10:00:00Z"),
        endAt: new Date("2026-10-21T10:00:01Z"),
        reservationType: "book",
      });

      expect(result.success).toBe(false);
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          message: "Invalid reservation duration",
          path: ["endAt"],
        })
      );
    });
  });

  describe("borrowing duration", () => {
    it("accepts a borrowing period of exactly one day", () => {
      const result = reservationSchema.safeParse({
        ...validReservation,
        startAt: new Date("2026-10-20T10:00:00Z"),
        endAt: new Date("2026-10-21T10:00:00Z"),
        reservationType: "borrow",
      });

      expect(result.success).toBe(true);
    });

    it("accepts a borrowing period of six days", () => {
      const result = reservationSchema.safeParse({
        ...validReservation,
        startAt: new Date("2026-10-20T10:00:00Z"),
        endAt: new Date("2026-10-26T10:00:00Z"),
        reservationType: "borrow",
      });

      expect(result.success).toBe(true);
    });

    it("rejects a borrowing period shorter than one day", () => {
      const result = reservationSchema.safeParse({
        ...validReservation,
        startAt: new Date("2026-10-20T10:00:00Z"),
        endAt: new Date("2026-10-21T09:59:59Z"),
        reservationType: "borrow",
      });

      expect(result.success).toBe(false);
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          message: "Invalid reservation duration",
          path: ["endAt"],
        })
      );
    });

    it("rejects a borrowing period longer than seven days", () => {
      const result = reservationSchema.safeParse({
        ...validReservation,
        startAt: new Date("2026-10-20T10:00:00Z"),
        endAt: new Date("2026-10-27T10:00:01Z"),
        reservationType: "borrow",
      });

      expect(result.success).toBe(false);
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          message: "Invalid reservation duration",
          path: ["endAt"],
        })
      );
    });
  });
});
