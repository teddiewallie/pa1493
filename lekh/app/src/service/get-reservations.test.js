import { beforeEach, describe, expect, it, vi } from "vitest";

const { auth, getReservationsQuery } = vi.hoisted(() => ({
  auth: vi.fn(),
  getReservationsQuery: vi.fn(),
}));

vi.mock("@/auth", () => ({ auth }));
vi.mock("@/query/reservation-query", () => ({ getReservationsQuery }));

import { getReservations } from "./get-reservations";

describe("getReservations", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    auth.mockResolvedValue({ user: { role_id: 1 } });
    getReservationsQuery.mockResolvedValue([
      { id: 1, item_id: 42, user_id: 7 },
      { id: 2, item_id: 43, user_id: 8 },
    ]);
  });

  it("returns reservations for an authenticated user", async () => {
    await expect(getReservations()).resolves.toEqual([
      { id: 1, item_id: 42, user_id: 7 },
      { id: 2, item_id: 43, user_id: 8 },
    ]);

    expect(getReservationsQuery).toHaveBeenCalledOnce();
  });

  it("returns an empty array when no session exists", async () => {
    auth.mockResolvedValue(null);

    await expect(getReservations()).resolves.toEqual([]);
    expect(getReservationsQuery).not.toHaveBeenCalled();
  });

  it("returns an empty array when the query fails", async () => {
    const error = new Error("Database error");
    getReservationsQuery.mockRejectedValue(error);
    const log = vi.spyOn(console, "log").mockImplementation(() => {});

    await expect(getReservations()).resolves.toEqual([]);

    expect(log).toHaveBeenCalledWith(error);
    log.mockRestore();
  });

  it("returns an empty array when there are no reservations", async () => {
    getReservationsQuery.mockResolvedValue([]);

    await expect(getReservations()).resolves.toEqual([]);
  });
});

