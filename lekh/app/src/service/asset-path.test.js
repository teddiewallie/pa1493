import path from "path";
import { describe, expect, it } from "vitest";
import { getAssetPath } from "./asset-path";

describe("getAssetPath", () => {
  it("returns the path to an asset", () => {
    expect(getAssetPath(42, "png")).toBe(
      path.join(process.cwd(), "assets", "42.png")
    );
  });

  it("supports string IDs", () => {
    expect(getAssetPath("logo", "svg")).toBe(
      path.join(process.cwd(), "assets", "logo.svg")
    );
  });

  it("supports different file extensions", () => {
    expect(getAssetPath(1, "jpg")).toBe(
      path.join(process.cwd(), "assets", "1.jpg")
    );
  });

  it("uses the current working directory", () => {
    const result = getAssetPath(5, "webp");

    expect(result).toContain(process.cwd());
    expect(path.basename(result)).toBe("5.webp");
    expect(path.basename(path.dirname(result))).toBe("assets");
  });
});

