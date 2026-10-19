
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  getAssetPath: vi.fn(),
  getAsset: vi.fn(),
  readFile: vi.fn(),
}));

vi.mock("@/auth", () => ({
  auth: mocks.auth,
}));

vi.mock("@/service/asset-path", () => ({
  getAssetPath: mocks.getAssetPath,
}));

vi.mock("@/service/get-asset", () => ({
  getAsset: mocks.getAsset,
}));

vi.mock("fs/promises", () => ({
  readFile: mocks.readFile,
}));

import { GET } from "./route";

describe("GET /api/asset/[id]", () => {
  const request = {};
  const params = Promise.resolve({ id: "42" });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 403 when the user is unauthenticated", async () => {
    mocks.auth.mockResolvedValue(null);

    const response = await GET(request, { params });

    expect(response.status).toBe(403);
    expect(await response.text()).toBe("Forbidden");
    expect(mocks.getAsset).not.toHaveBeenCalled();
    expect(mocks.getAssetPath).not.toHaveBeenCalled();
    expect(mocks.readFile).not.toHaveBeenCalled();
  });

  it("returns the asset with its MIME type and private cache headers", async () => {
    const image = Buffer.from("fake image data");

    mocks.auth.mockResolvedValue({ user: { id: "7" } });
    mocks.getAsset.mockResolvedValue({
      mime_type: "image/png",
      extension: "png",
    });
    mocks.getAssetPath.mockReturnValue("/assets/42.png");
    mocks.readFile.mockResolvedValue(image);

    const response = await GET(request, { params });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/png");
    expect(response.headers.get("Cache-Control")).toBe(
      "private, max-age=3600",
    );
    expect(Buffer.from(await response.arrayBuffer())).toEqual(image);

    expect(mocks.getAsset).toHaveBeenCalledWith("42");
    expect(mocks.getAssetPath).toHaveBeenCalledWith("42", "png");
    expect(mocks.readFile).toHaveBeenCalledWith("/assets/42.png");
  });

  it("returns the fallback image with status 404 when the asset lookup fails", async () => {
    const fallbackImage = Buffer.from("fallback image");

    mocks.auth.mockResolvedValue({ user: { id: "7" } });
    mocks.getAsset.mockRejectedValue(new Error("Asset not found"));
    mocks.getAssetPath.mockReturnValue("/assets/0.jpg");
    mocks.readFile.mockResolvedValue(fallbackImage);

    const response = await GET(request, { params });

    expect(response.status).toBe(404);
    expect(response.headers.get("Content-Type")).toBe("image/jpeg");
    expect(response.headers.get("Cache-Control")).toBe(
      "private, max-age=3600",
    );
    expect(Buffer.from(await response.arrayBuffer())).toEqual(fallbackImage);

    expect(mocks.getAssetPath).toHaveBeenCalledWith("0", "jpg");
    expect(mocks.readFile).toHaveBeenCalledWith("/assets/0.jpg");
  });

  it("returns the fallback image when reading the requested asset fails", async () => {
    const fallbackImage = Buffer.from("fallback image");

    mocks.auth.mockResolvedValue({ user: { id: "7" } });
    mocks.getAsset.mockResolvedValue({
      mime_type: "image/webp",
      extension: "webp",
    });
    mocks.getAssetPath.mockImplementation((id, extension) => {
      if (id === "42") return "/assets/42.webp";
      return "/assets/0.jpg";
    });

    mocks.readFile
      .mockRejectedValueOnce(new Error("File missing"))
      .mockResolvedValueOnce(fallbackImage);

    const response = await GET(request, { params });

    expect(response.status).toBe(404);
    expect(response.headers.get("Content-Type")).toBe("image/jpeg");
    expect(Buffer.from(await response.arrayBuffer())).toEqual(fallbackImage);

    expect(mocks.readFile).toHaveBeenNthCalledWith(1, "/assets/42.webp");
    expect(mocks.readFile).toHaveBeenNthCalledWith(2, "/assets/0.jpg");
  });

  it("rejects if the fallback image cannot be read", async () => {
    mocks.auth.mockResolvedValue({ user: { id: "7" } });
    mocks.getAsset.mockRejectedValue(new Error("Asset not found"));
    mocks.getAssetPath.mockReturnValue("/assets/0.jpg");
    mocks.readFile.mockRejectedValue(new Error("Fallback missing"));

    await expect(GET(request, { params })).rejects.toThrow(
      "Fallback missing",
    );
  });
});

