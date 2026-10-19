
import { beforeEach, describe, expect, it, vi } from "vitest";

const { query } = vi.hoisted(() => ({
  query: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  default: { query },
}));

import {
  addAssetQuery,
  getAssetQuery,
  removeAssetQuery,
} from "./asset-query";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("addAssetQuery", () => {
  it("inserts an asset and returns its ID", async () => {
    query.mockResolvedValue({ insertId: 42 });

    await expect(addAssetQuery("image/png", "png")).resolves.toBe(42);

    expect(query).toHaveBeenCalledWith(
      "INSERT INTO asset (mime_type, extension) VALUES (?, ?)",
      ["image/png", "png"],
    );
  });

  it("propagates database errors", async () => {
    query.mockRejectedValue(new Error("Database error"));

    await expect(addAssetQuery("image/png", "png")).rejects.toThrow(
      "Database error",
    );
  });
});

describe("getAssetQuery", () => {
  it("returns the asset matching the ID", async () => {
    const asset = { mime_type: "image/png", extension: "png" };
    query.mockResolvedValue([asset]);

    await expect(getAssetQuery(42)).resolves.toEqual(asset);

    expect(query).toHaveBeenCalledWith(
      "SELECT mime_type, extension FROM asset WHERE id=?",
      [42],
    );
  });

  it("returns undefined when the asset does not exist", async () => {
    query.mockResolvedValue([]);

    await expect(getAssetQuery(999)).resolves.toBeUndefined();
  });

  it("propagates database errors", async () => {
    query.mockRejectedValue(new Error("Database error"));

    await expect(getAssetQuery(42)).rejects.toThrow("Database error");
  });
});

describe("removeAssetQuery", () => {
  it("deletes the asset matching the ID", async () => {
    query.mockResolvedValue({ affectedRows: 1 });

    await expect(removeAssetQuery(42)).resolves.toBeUndefined();

    expect(query).toHaveBeenCalledWith(
      "DELETE FROM asset WHERE id=?",
      [42],
    );
  });

  it("propagates database errors", async () => {
    query.mockRejectedValue(new Error("Database error"));

    await expect(removeAssetQuery(42)).rejects.toThrow("Database error");
  });
});

