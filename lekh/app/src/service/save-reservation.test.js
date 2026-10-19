import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  auth,
  reservationSchema,
  addReservationQuery,
  approveReservationQuery,
  denyReservationQuery,
} = vi.hoisted(() => ({
  auth: vi.fn(),
  reservationSchema: { safeParse: vi.fn() },
  addReservationQuery: vi.fn(),
  approveReservationQuery: vi.fn(),
  denyReservationQuery: vi.fn(),
}));

vi.mock("@/auth", () => ({ auth }));
vi.mock("@/schema/reservation-schema", () => ({ reservationSchema }));
vi.mock("@/query/reservation-query", () => ({
  addReservationQuery,
  approveReservationQuery,
  denyReservationQuery,
}));

import {
  addReservation,
  approveReservation,
  denyReservation,
} from "./save-reservation";

const validReservation = {
  itemId: 42,
  startAt: new Date("2026-10-20T10:00:00"),
  endAt: new Date("2026-10-20T12:00:00"),
  isPending: true,
};

describe("addReservation", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    auth.mockResolvedValue({ user: { id: 7, role_id: 2 } });
    reservationSchema.safeParse.mockReturnValue({ success: true });
    addReservationQuery.mockResolvedValue(undefined);
  });

  it("adds a valid reservation for the authenticated user", async () => {
    await expect(addReservation(validReservation)).resolves.toBe(true);

    expect(reservationSchema.safeParse).toHaveBeenCalledWith(validReservation);
    expect(addReservationQuery).toHaveBeenCalledWith(validReservation, 7);
  });

  it("returns false when validation fails", async () => {
    reservationSchema.safeParse.mockReturnValue({ success: false });

    await expect(addReservation(validReservation)).resolves.toBe(false);
    expect(addReservationQuery).not.toHaveBeenCalled();
  });

  it("returns false when the reservation already has an ID", async () => {
    await expect(
      addReservation({ ...validReservation, id: 99 })
    ).resolves.toBe(false);

    expect(addReservationQuery).not.toHaveBeenCalled();
  });

  it("returns false when there is no session", async () => {
    auth.mockResolvedValue(null);

    await expect(addReservation(validReservation)).resolves.toBe(false);
    expect(addReservationQuery).not.toHaveBeenCalled();
  });

  it("returns false when adding the reservation fails", async () => {
    addReservationQuery.mockRejectedValue(new Error("Database error"));
    vi.spyOn(console, "log").mockImplementation(() => {});

    await expect(addReservation(validReservation)).resolves.toBe(false);
  });
});

describe("approveReservation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.mockResolvedValue({ user: { id: 1, role_id: 1 } });
    approveReservationQuery.mockResolvedValue(undefined);
  });

  it("approves a reservation for a maintainer", async () => {
    await expect(approveReservation(42)).resolves.toBe(true);
    expect(approveReservationQuery).toHaveBeenCalledWith(42);
    expect(denyReservationQuery).not.toHaveBeenCalled();
  });

  it("returns false when there is no session", async () => {
    auth.mockResolvedValue(null);

    await expect(approveReservation(42)).resolves.toBe(false);
    expect(approveReservationQuery).not.toHaveBeenCalled();
  });

  it("returns false for a non-maintainer", async () => {
    auth.mockResolvedValue({ user: { id: 2, role_id: 2 } });

    await expect(approveReservation(42)).resolves.toBe(false);
    expect(approveReservationQuery).not.toHaveBeenCalled();
  });

  it("returns false when the approval query fails", async () => {
    approveReservationQuery.mockRejectedValue(new Error("Database error"));

    await expect(approveReservation(42)).resolves.toBe(false);
  });
});

describe("denyReservation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.mockResolvedValue({ user: { id: 1, role_id: 1 } });
    denyReservationQuery.mockResolvedValue(undefined);
  });

  it("denies a reservation for a maintainer", async () => {
    await expect(denyReservation(42)).resolves.toBe(true);
    expect(denyReservationQuery).toHaveBeenCalledWith(42);
    expect(approveReservationQuery).not.toHaveBeenCalled();
  });

  it("returns false when there is no session", async () => {
    auth.mockResolvedValue(null);

    await expect(denyReservation(42)).resolves.toBe(false);
    expect(denyReservationQuery).not.toHaveBeenCalled();
  });

  it("returns false for a non-maintainer", async () => {
    auth.mockResolvedValue({ user: { id: 2, role_id: 2 } });

    await expect(denyReservation(42)).resolves.toBe(false);
    expect(denyReservationQuery).not.toHaveBeenCalled();
  });

  it("returns false when the denial query fails", async () => {
    denyReservationQuery.mockRejectedValue(new Error("Database error"));

    await expect(denyReservation(42)).resolves.toBe(false);
  });
});

