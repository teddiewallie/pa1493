import { afterEach, describe, expect, it, vi } from "vitest";

import { createItemSchema } from "./item-schema";

const groups = [
  { id: 1, name: "Oscilloscopes" },
  { id: 2, name: "Microcontrollers" },
];

const statuses = [
  { id: 1, name: "Available" },
  { id: 2, name: "On Loan" },
  { id: 3, name: "In Repair" },
];

const validItem = {
  name: "Oscilloscope",
  description: "Digital oscilloscope",
  knownIssues: "",
  shelf: "A1",
  serial: "OSC-123",
  borrowable: true,
  bookable: false,
  statusId: 1,
  groupId: 1,
};

const makeImage = (name, size, type) =>
  new File([new Uint8Array(size)], name, { type });

describe("createItemSchema", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("accepts a valid item with an image in create mode", () => {
    const schema = createItemSchema(groups, statuses);
    const item = {
      ...validItem,
      image: makeImage("scope.png", 1024, "image/png"),
    };

    expect(schema.safeParse(item).success).toBe(true);
  });

  it("accepts an item without an image in edit mode", () => {
    const schema = createItemSchema(groups, statuses, true);

    expect(schema.safeParse(validItem).success).toBe(true);
  });

  it("requires an image in create mode", () => {
    const schema = createItemSchema(groups, statuses);

    const result = schema.safeParse(validItem);

    expect(result.success).toBe(false);
    expect(result.error.issues.map((issue) => issue.path)).toContainEqual([
      "image",
    ]);
  });

  it("accepts an image in edit mode when provided", () => {
    const schema = createItemSchema(groups, statuses, true);

    expect(
      schema.safeParse({
        ...validItem,
        image: makeImage("scope.png", 1024, "image/png"),
      }).success
    ).toBe(true);
  });

  it("rejects an image larger than 5 MB", () => {
    const schema = createItemSchema(groups, statuses);
    const image = makeImage("large.png", 5 * 1024 * 1024 + 1, "image/png");

    const result = schema.safeParse({ ...validItem, image });

    expect(result.success).toBe(false);
    expect(result.error.issues).toContainEqual(
      expect.objectContaining({
        message: "Image must be smaller than or equal to 5MB.",
      })
    );
  });

  it("accepts an image exactly 5 MB in size", () => {
    const schema = createItemSchema(groups, statuses);
    const image = makeImage("limit.png", 5 * 1024 * 1024, "image/png");

    expect(schema.safeParse({ ...validItem, image }).success).toBe(true);
  });

  it("rejects a file that is not an image", () => {
    const schema = createItemSchema(groups, statuses);
    const file = makeImage("document.txt", 100, "text/plain");

    const result = schema.safeParse({ ...validItem, image: file });

    expect(result.success).toBe(false);
    expect(result.error.issues).toContainEqual(
      expect.objectContaining({
        message: "File must be an image.",
      })
    );
  });

  it("rejects a value that is not a File", () => {
    const schema = createItemSchema(groups, statuses);

    expect(
      schema.safeParse({ ...validItem, image: "scope.png" }).success
    ).toBe(false);
  });

  it("rejects an unknown status ID", () => {
    const schema = createItemSchema(groups, statuses);

    const result = schema.safeParse({ ...validItem, statusId: 999 });

    expect(result.success).toBe(false);
    expect(result.error.issues).toContainEqual(
      expect.objectContaining({ message: "Invalid status" })
    );
  });

  it("rejects an unknown group ID", () => {
    const schema = createItemSchema(groups, statuses);

    const result = schema.safeParse({ ...validItem, groupId: 999 });

    expect(result.success).toBe(false);
    expect(result.error.issues).toContainEqual(
      expect.objectContaining({ message: "Invalid group" })
    );
  });

  it("rejects non-numeric status and group IDs", () => {
    const schema = createItemSchema(groups, statuses);

    expect(
      schema.safeParse({ ...validItem, statusId: "1" }).success
    ).toBe(false);

    expect(
      schema.safeParse({ ...validItem, groupId: "1" }).success
    ).toBe(false);
  });

  it.each([
    ["name", ""],
    ["serial", ""],
  ])("rejects an empty %s", (field, value) => {
    const schema = createItemSchema(groups, statuses);

    expect(
      schema.safeParse({
        ...validItem,
        image: makeImage("scope.png", 100, "image/png"),
        [field]: value,
      }).success
    ).toBe(false);
  });

  it.each(["description", "knownIssues", "shelf"])(
    "accepts an empty %s",
    (field) => {
      const schema = createItemSchema(groups, statuses);

      expect(
        schema.safeParse({
          ...validItem,
          image: makeImage("scope.png", 100, "image/png"),
          [field]: "",
        }).success
      ).toBe(true);
    }
  );

  it("rejects missing required fields", () => {
    const schema = createItemSchema(groups, statuses);
    const requiredFields = [
      "name",
      "description",
      "knownIssues",
      "shelf",
      "serial",
      "borrowable",
      "bookable",
      "statusId",
      "groupId",
      "image",
    ];

    for (const field of requiredFields) {
      const item = {
        ...validItem,
        image: makeImage("scope.png", 100, "image/png"),
      };
      delete item[field];

      expect(schema.safeParse(item).success, `field: ${field}`).toBe(false);
    }
  });

  it("accepts optional integer-like metadata IDs when numeric", () => {
    const schema = createItemSchema(groups, statuses);

    expect(
      schema.safeParse({
        ...validItem,
        id: 42,
        assetId: 7,
        image: makeImage("scope.png", 100, "image/png"),
      }).success
    ).toBe(true);
  });

  it("rejects non-boolean borrowable and bookable values", () => {
    const schema = createItemSchema(groups, statuses);
    const image = makeImage("scope.png", 100, "image/png");

    expect(
      schema.safeParse({ ...validItem, image, borrowable: "true" }).success
    ).toBe(false);

    expect(
      schema.safeParse({ ...validItem, image, bookable: 0 }).success
    ).toBe(false);
  });
});

