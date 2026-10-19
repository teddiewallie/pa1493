import { describe, expect, it } from "vitest";

import { createArticleSchema } from "./article-schema";

describe("createArticleSchema", () => {
  const schema = createArticleSchema();

  const validArticle = {
    title: "Oscilloscope guide",
    content: "How to use an oscilloscope.",
    typeId: 1,
    groupId: 2,
    itemId: 3,
    userId: 4,
  };

  it("accepts a valid article", () => {
    expect(schema.safeParse(validArticle).success).toBe(true);
  });

  it("accepts an article with an optional id", () => {
    expect(
      schema.safeParse({ ...validArticle, id: 10 }).success
    ).toBe(true);
  });

  it("accepts null groupId and itemId", () => {
    expect(
      schema.safeParse({
        ...validArticle,
        groupId: null,
        itemId: null,
      }).success
    ).toBe(true);
  });

  it.each([
    ["title", ""],
    ["content", ""],
  ])("rejects an empty %s", (field, value) => {
    const result = schema.safeParse({
      ...validArticle,
      [field]: value,
    });

    expect(result.success).toBe(false);
    expect(result.error.issues).toContainEqual(
      expect.objectContaining({
        path: [field],
        message: field === "title" ? "Title is required" : "Content is required",
      })
    );
  });

  it.each([
    ["typeId", 0],
    ["typeId", -1],
    ["typeId", 1.5],
    ["groupId", 0],
    ["groupId", -1],
    ["groupId", 1.5],
    ["itemId", 0],
    ["itemId", -1],
    ["itemId", 1.5],
    ["userId", 0],
    ["userId", -1],
    ["userId", 1.5],
  ])("rejects invalid %s value %s", (field, value) => {
    expect(
      schema.safeParse({
        ...validArticle,
        [field]: value,
      }).success
    ).toBe(false);
  });

  it.each([
    "title",
    "content",
    "typeId",
    "groupId",
    "itemId",
    "userId",
  ])("rejects a missing %s", (field) => {
    const article = { ...validArticle };
    delete article[field];

    expect(schema.safeParse(article).success).toBe(false);
  });

  it("rejects non-numeric ids", () => {
    expect(
      schema.safeParse({
        ...validArticle,
        typeId: "1",
      }).success
    ).toBe(false);
  });

  it("rejects a non-integer article id", () => {
    expect(
      schema.safeParse({
        ...validArticle,
        id: 1.5,
      }).success
    ).toBe(false);
  });

  it("allows id to be omitted but rejects null", () => {
    expect(schema.safeParse(validArticle).success).toBe(true);
    expect(
      schema.safeParse({ ...validArticle, id: null }).success
    ).toBe(false);
  });
});

