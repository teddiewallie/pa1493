import { beforeEach, describe, expect, it, vi } from "vitest";

const { auth, getAssetQuery } = vi.hoisted(() => ({
  auth: vi.fn(),
  getAssetQuery: vi.fn(),
}));

vi.mock("@/auth", () => ({ auth }));
vi.mock("@/query/asset-query", () => ({ getAssetQuery }));

import { getAsset } from "./get-asset";

describe("getAsset", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    auth.mockResolvedValue({ user: { role_id: 1 } });
    getAssetQuery.mockResolvedValue({
      id: 42,
      filename: "asset.png",
    });
  });

  it("returns the asset for an authenticated user", async () => {
    await expect(getAsset(42)).resolves.toEqual({
      id: 42,
      filename: "asset.png",
    });

    expect(getAssetQuery).toHaveBeenCalledWith(42);
  });

  it("throws when no session exists", async () => {
    auth.mockResolvedValue(null);

    await expect(getAsset(42)).rejects.toThrow();
    expect(getAssetQuery).not.toHaveBeenCalled();
  });

  it("propagates errors from the asset query", async () => {
    const error = new Error("Database error");
    getAssetQuery.mockRejectedValue(error);

    await expect(getAsset(42)).rejects.toThrow(error);
  });

  it("passes different IDs through to the query", async () => {
    await getAsset(7);

    expect(getAssetQuery).toHaveBeenCalledWith(7);
  });
});

