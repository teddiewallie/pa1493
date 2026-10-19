
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { query } = vi.hoisted(() => ({
  query: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  default: { query },
}));

import {
  addReservationQuery,
  getReservationsQuery,
  approveReservationQuery,
  denyReservationQuery,
  denyReservationsByUserIdQuery,
  setReturnedQuery,
} from "./reservation-query";

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("addReservationQuery", () => {
  it("inserts a reservation with the supplied user ID", async () => {
    query.mockResolvedValue({ insertId: 42 });

    const reservation = {
      startAt: "2026-10-20 09:00:00",
      endAt: "2026-10-20 10:00:00",
      itemId: 7,
      isPending: true,
    };

    await expect(addReservationQuery(reservation, 3)).resolves.toBeUndefined();

    expect(query).toHaveBeenCalledWith(
      "INSERT INTO reservation (start_at, end_at, user_id, item_id, is_pending) VALUES (?, ?, ?, ?, ?)",
      [
        reservation.startAt,
        reservation.endAt,
        3,
        reservation.itemId,
        reservation.isPending,
      ],
    );
  });

  it("propagates database errors", async () => {
    query.mockRejectedValue(new Error("Database error"));

    await expect(
      addReservationQuery(
        {
          startAt: "2026-10-20 09:00:00",
          endAt: "2026-10-20 10:00:00",
          itemId: 7,
          isPending: true,
        },
        3,
      ),
    ).rejects.toThrow("Database error");
  });
});

describe("getReservationsQuery", () => {
  it("returns all reservations", async () => {
    const reservations = [
      { id: 1, user_id: 3, item_id: 7 },
      { id: 2, user_id: 4, item_id: 8 },
    ];

    query.mockResolvedValue(reservations);

    await expect(getReservationsQuery()).resolves.toEqual(reservations);
    expect(query).toHaveBeenCalledWith("SELECT * FROM reservation");
  });

  it("propagates database errors", async () => {
    query.mockRejectedValue(new Error("Database error"));

    await expect(getReservationsQuery()).rejects.toThrow("Database error");
  });
});

describe("approveReservationQuery", () => {
  it("sets the reservation's pending status to zero", async () => {
    query.mockResolvedValue({ affectedRows: 1 });

    await expect(approveReservationQuery(42)).resolves.toBeUndefined();

    expect(query).toHaveBeenCalledWith(
      "UPDATE reservation SET is_pending=? WHERE id=?",
      [0, 42],
    );
  });

  it("propagates database errors", async () => {
    query.mockRejectedValue(new Error("Database error"));

    await expect(approveReservationQuery(42)).rejects.toThrow(
      "Database error",
    );
  });
});

describe("denyReservationQuery", () => {
  it("deletes a reservation by ID", async () => {
    query.mockResolvedValue({ affectedRows: 1 });

    await expect(denyReservationQuery(42)).resolves.toBeUndefined();

    expect(query).toHaveBeenCalledWith(
      "DELETE FROM reservation WHERE id=?",
      [42],
    );
  });

  it("propagates database errors", async () => {
    query.mockRejectedValue(new Error("Database error"));

    await expect(denyReservationQuery(42)).rejects.toThrow(
      "Database error",
    );
  });
});

describe("denyReservationsByUserIdQuery", () => {
  it("deletes all reservations belonging to a user", async () => {
    const result = { affectedRows: 2 };
    query.mockResolvedValue(result);

    await expect(denyReservationsByUserIdQuery(3)).resolves.toEqual(result);

    expect(query).toHaveBeenCalledWith(
      "DELETE FROM reservation WHERE user_id=?",
      [3],
    );
  });

  it("propagates database errors", async () => {
    query.mockRejectedValue(new Error("Database error"));

    await expect(denyReservationsByUserIdQuery(3)).rejects.toThrow(
      "Database error",
    );
  });
});

describe("setReturnedQuery", () => {
  it("sets returned_at and end_at to the current time", async () => {
    const fixedDate = new Date("2026-10-19T12:00:00.000Z");
    vi.setSystemTime(fixedDate);
    query.mockResolvedValue({ affectedRows: 1 });

    await expect(setReturnedQuery(42)).resolves.toBeUndefined();

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining("SET returned_at=?, end_at=?"),
      [fixedDate, fixedDate, 42],
    );
  });

  it("propagates database errors", async () => {
    query.mockRejectedValue(new Error("Database error"));

    await expect(setReturnedQuery(42)).rejects.toThrow("Database error");
  });
});

