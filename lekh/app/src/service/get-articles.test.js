import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  auth,
  getArticlesQuery,
  getArticleTypesQuery,
} = vi.hoisted(() => ({
  auth: vi.fn(),
  getArticlesQuery: vi.fn(),
  getArticleTypesQuery: vi.fn(),
}));

vi.mock("@/auth", () => ({ auth }));
vi.mock("@/query/article-query", () => ({
  getArticlesQuery,
  getArticleTypesQuery,
}));

import { getArticles } from "./get-articles";

describe("getArticles", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    auth.mockResolvedValue({ user: { role_id: 1 } });
    getArticlesQuery.mockResolvedValue([{ id: 1, title: "Guide" }]);
    getArticleTypesQuery.mockResolvedValue([{ id: 1, name: "Guide" }]);
  });

  it("returns an empty array when no session exists", async () => {
    auth.mockResolvedValue(null);

    await expect(getArticles()).resolves.toEqual([]);
    expect(getArticlesQuery).not.toHaveBeenCalled();
    expect(getArticleTypesQuery).not.toHaveBeenCalled();
  });

  it("returns articles and article types for an authenticated user", async () => {
    await expect(getArticles()).resolves.toEqual({
      articles: [{ id: 1, title: "Guide" }],
      articleTypes: [{ id: 1, name: "Guide" }],
    });
  });

  it("fetches articles before article types", async () => {
    await getArticles();

    expect(getArticlesQuery).toHaveBeenCalledOnce();
    expect(getArticleTypesQuery).toHaveBeenCalledOnce();

    expect(getArticlesQuery.mock.invocationCallOrder[0])
      .toBeLessThan(getArticleTypesQuery.mock.invocationCallOrder[0]);
  });

  it("returns an empty array if fetching articles fails", async () => {
    getArticlesQuery.mockRejectedValue(new Error("Database error"));

    await expect(getArticles()).resolves.toEqual([]);
    expect(getArticleTypesQuery).not.toHaveBeenCalled();
  });

  it("returns an empty array if fetching article types fails", async () => {
    getArticleTypesQuery.mockRejectedValue(new Error("Database error"));

    await expect(getArticles()).resolves.toEqual([]);
  });
});

