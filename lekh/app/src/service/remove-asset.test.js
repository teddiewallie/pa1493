import { beforeEach, describe, expect, it, vi } from "vitest";

const { auth, removeAssetQuery } = vi.hoisted(() => ({
  auth: vi.fn(),
  removeAssetQuery: vi.fn(),
}));

vi.mock("@/auth", () => ({ auth }));
vi.mock("@/query/asset-query", () => ({ removeAssetQuery }));

import { removeAsset } from "./remove-asset";

describe("removeAsset", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    auth.mockResolvedValue({ user: { role_id: 1 } });
    removeAssetQuery.mockResolvedValue(undefined);
  });

  it("removes an asset for an authenticated user", async () => {
    await expect(removeAsset(42)).resolves.toBeUndefined();

    expect(removeAssetQuery).toHaveBeenCalledOnce();
    expect(removeAssetQuery).toHaveBeenCalledWith(42);
  });

  it("throws when no session exists", async () => {
    auth.mockResolvedValue(null);

    await expect(removeAsset(42)).rejects.toThrow();
    expect(removeAssetQuery).not.toHaveBeenCalled();
  });

  it("propagates errors from the query", async () => {
    const error = new Error("Database error");
    removeAssetQuery.mockRejectedValue(error);

    await expect(removeAsset(42)).rejects.toThrow(error);
  });

  it("passes different asset IDs through to the query", async () => {
    await removeAsset(7);

    expect(removeAssetQuery).toHaveBeenCalledWith(7);
  });
});

