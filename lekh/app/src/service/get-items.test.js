import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  auth,
  getItemsQuery,
  getItemStatusMetaQuery,
} = vi.hoisted(() => ({
  auth: vi.fn(),
  getItemsQuery: vi.fn(),
  getItemStatusMetaQuery: vi.fn(),
}));

vi.mock("@/auth", () => ({ auth }));
vi.mock("@/query/item-query", () => ({
  getItemsQuery,
  getItemStatusMetaQuery,
}));

import { getItems } from "./get-items";

describe("getItems", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    auth.mockResolvedValue({ user: { role_id: 1 } });
    getItemsQuery.mockResolvedValue([
      { id: 1, name: "Oscilloscope" },
      { id: 2, name: "Arduino" },
    ]);
    getItemStatusMetaQuery.mockResolvedValue([
      { id: 1, name: "Available" },
      { id: 2, name: "On Loan" },
    ]);
  });

  it("returns items and status metadata for an authenticated user", async () => {
    await expect(getItems()).resolves.toEqual({
      items: [
        { id: 1, name: "Oscilloscope" },
        { id: 2, name: "Arduino" },
      ],
      meta: {
        status: [
          { id: 1, name: "Available" },
          { id: 2, name: "On Loan" },
        ],
      },
    });

    expect(getItemsQuery).toHaveBeenCalledOnce();
    expect(getItemStatusMetaQuery).toHaveBeenCalledOnce();
  });

  it("returns an empty array when no session exists", async () => {
    auth.mockResolvedValue(null);

    await expect(getItems()).resolves.toEqual([]);
    expect(getItemsQuery).not.toHaveBeenCalled();
    expect(getItemStatusMetaQuery).not.toHaveBeenCalled();
  });

  it("returns an empty array when fetching items fails", async () => {
    getItemsQuery.mockRejectedValue(new Error("Database error"));

    await expect(getItems()).resolves.toEqual([]);
    expect(getItemStatusMetaQuery).not.toHaveBeenCalled();
  });

  it("returns an empty array when fetching status metadata fails", async () => {
    getItemStatusMetaQuery.mockRejectedValue(new Error("Database error"));

    await expect(getItems()).resolves.toEqual([]);
  });

  it("fetches items before status metadata", async () => {
    await getItems();

    expect(getItemsQuery.mock.invocationCallOrder[0])
      .toBeLessThan(getItemStatusMetaQuery.mock.invocationCallOrder[0]);
  });

  it("returns empty lists when both queries return empty results", async () => {
    getItemsQuery.mockResolvedValue([]);
    getItemStatusMetaQuery.mockResolvedValue([]);

    await expect(getItems()).resolves.toEqual({
      items: [],
      meta: { status: [] },
    });
  });
});

