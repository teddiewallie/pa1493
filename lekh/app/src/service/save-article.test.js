import { beforeEach, describe, expect, it, vi } from "vitest";

const { auth, addArticleQuery, updateArticleQuery } = vi.hoisted(() => ({
  auth: vi.fn(),
  addArticleQuery: vi.fn(),
  updateArticleQuery: vi.fn(),
}));

vi.mock("@/auth", () => ({ auth }));
vi.mock("@/query/article-query", () => ({
  addArticleQuery,
  updateArticleQuery,
}));

import { saveArticle } from "./save-article";

const article = {
  title: "Test article",
  content: "Article content",
  articleType: 3,
  itemId: null,
};

describe("saveArticle", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    auth.mockResolvedValue({ role_id: 1 });
    addArticleQuery.mockResolvedValue(true);
    updateArticleQuery.mockResolvedValue(undefined);
  });

  it("returns false when no session exists", async () => {
    auth.mockResolvedValue(null);

    await expect(saveArticle(article)).resolves.toBe(false);
    expect(addArticleQuery).not.toHaveBeenCalled();
    expect(updateArticleQuery).not.toHaveBeenCalled();
  });

  it("creates an article when no ID is provided", async () => {
    await expect(saveArticle(article)).resolves.toBe(true);

    expect(addArticleQuery).toHaveBeenCalledWith(article);
    expect(updateArticleQuery).not.toHaveBeenCalled();
  });

  it("returns the result of adding a new article", async () => {
    addArticleQuery.mockResolvedValue(17);

    await expect(saveArticle(article)).resolves.toBe(17);
  });

  it("updates an existing article when an ID is provided", async () => {
    const existingArticle = { ...article, id: 42 };

    await expect(saveArticle(existingArticle)).resolves.toBe(true);

    expect(updateArticleQuery).toHaveBeenCalledWith(existingArticle);
    expect(addArticleQuery).not.toHaveBeenCalled();
  });

  it("rejects student articles linked to an item", async () => {
    auth.mockResolvedValue({ role_id: 2 });

    await expect(
      saveArticle({ ...article, itemId: 7 })
    ).resolves.toBe(false);

    expect(addArticleQuery).not.toHaveBeenCalled();
    expect(updateArticleQuery).not.toHaveBeenCalled();
  });

  it("rejects student articles whose article type is not 3", async () => {
    auth.mockResolvedValue({ role_id: 2 });

    await expect(
      saveArticle({ ...article, articleType: 1 })
    ).resolves.toBe(false);

    expect(addArticleQuery).not.toHaveBeenCalled();
    expect(updateArticleQuery).not.toHaveBeenCalled();
  });

  it("allows students to create type 3 articles without an item", async () => {
    auth.mockResolvedValue({ role_id: 2 });

    await expect(saveArticle(article)).resolves.toBe(true);
    expect(addArticleQuery).toHaveBeenCalledWith(article);
  });

  it("returns false when adding an article fails", async () => {
    const error = new Error("Database error");
    addArticleQuery.mockRejectedValue(error);
    vi.spyOn(console, "log").mockImplementation(() => {});

    await expect(saveArticle(article)).resolves.toBe(false);
  });

  it("returns false when updating an article fails", async () => {
    const error = new Error("Database error");
    updateArticleQuery.mockRejectedValue(error);
    vi.spyOn(console, "log").mockImplementation(() => {});

    await expect(
      saveArticle({ ...article, id: 42 })
    ).resolves.toBe(false);
  });
});

