
import { beforeEach, describe, expect, it, vi } from "vitest";

const { query, addAssetQuery } = vi.hoisted(() => ({
  query: vi.fn(),
  addAssetQuery: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  default: { query },
}));

vi.mock("./asset-query", () => ({
  addAssetQuery,
}));

import {
  addItemQuery,
  getItemsQuery,
  getItemStatusMetaQuery,
  updateItemQuery,
  addReportQuery,
  setGroupItemsAsUnsortedQuery,
} from "./item-query";

beforeEach(() => {
  vi.clearAllMocks();
});

const itemData = {
  id: 42,
  name: "Temperature sensor",
  serial: "TEMP-001",
  description: "A temperature sensor",
  knownIssues: "None known",
  shelf: "A1",
  userId: 3,
  assetId: 10,
  statusId: 1,
  groupId: 5,
  borrowable: true,
  bookable: false,
};

const image = {
  name: "Sensor.PNG",
  type: "image/png",
};

describe("addReportQuery", () => {
  it("prepends the reported issue to the known issues", async () => {
    query.mockResolvedValue({ affectedRows: 1 });

    await expect(
      addReportQuery({
        id: 42,
        reportIssue: "Intermittent readings",
        knownIssues: "Calibration required",
      }),
    ).resolves.toBeUndefined();

    expect(query).toHaveBeenCalledWith(
      "UPDATE item SET known_issues=? WHERE id=?",
      ["Intermittent readings\n\nCalibration required", 42],
    );
  });

  it("propagates database errors", async () => {
    query.mockRejectedValue(new Error("Database error"));

    await expect(
      addReportQuery({
        id: 42,
        reportIssue: "Sensor failure",
        knownIssues: "",
      }),
    ).rejects.toThrow("Database error");
  });
});

describe("addItemQuery", () => {
  it("creates an asset, inserts the item, and returns the asset ID and extension", async () => {
    addAssetQuery.mockResolvedValue(99);
    query.mockResolvedValue({ insertId: 42 });

    const data = { ...itemData, image };

    await expect(addItemQuery(data)).resolves.toEqual({
      id: 99,
      extension: "png",
    });

    expect(addAssetQuery).toHaveBeenCalledWith("image/png", "png");

    expect(query).toHaveBeenCalledWith(
      "INSERT INTO item (name, serial, description, known_issues, shelf, user_id, asset_id, status_id, group_id, borrowable, bookable) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        data.name,
        data.serial,
        data.description,
        data.knownIssues,
        data.shelf,
        data.userId,
        99,
        data.statusId,
        data.groupId,
        data.borrowable,
        data.bookable,
      ],
    );
  });

  it("lowercases the image extension", async () => {
    addAssetQuery.mockResolvedValue(99);
    query.mockResolvedValue({ insertId: 42 });

    await addItemQuery({ ...itemData, image });

    expect(addAssetQuery).toHaveBeenCalledWith("image/png", "png");
  });

  it("does not insert the item if creating its asset fails", async () => {
    addAssetQuery.mockRejectedValue(new Error("Asset creation failed"));

    await expect(
      addItemQuery({ ...itemData, image }),
    ).rejects.toThrow("Asset creation failed");

    expect(query).not.toHaveBeenCalled();
  });

  it("propagates database errors", async () => {
    addAssetQuery.mockResolvedValue(99);
    query.mockRejectedValue(new Error("Database error"));

    await expect(
      addItemQuery({ ...itemData, image }),
    ).rejects.toThrow("Database error");
  });
});

describe("updateItemQuery", () => {
  it("updates an item without creating a new asset when no image is supplied", async () => {
    query.mockResolvedValue({ affectedRows: 1 });

    await expect(updateItemQuery(itemData)).resolves.toEqual({
      id: null,
      extension: null,
    });

    expect(addAssetQuery).not.toHaveBeenCalled();

    expect(query).toHaveBeenCalledWith(
      "UPDATE item SET name=?, serial=?, description=?, known_issues=?, shelf=?, user_id=?, asset_id=?, status_id=?, group_id=?, borrowable=?, bookable=? WHERE id=?",
      [
        itemData.name,
        itemData.serial,
        itemData.description,
        itemData.knownIssues,
        itemData.shelf,
        itemData.userId,
        itemData.assetId,
        itemData.statusId,
        itemData.groupId,
        itemData.borrowable,
        itemData.bookable,
        itemData.id,
      ],
    );
  });

  it("creates a new asset and uses it when updating an item's image", async () => {
    addAssetQuery.mockResolvedValue(99);
    query.mockResolvedValue({ affectedRows: 1 });

    await expect(
      updateItemQuery({ ...itemData, image }),
    ).resolves.toEqual({
      id: 99,
      extension: "png",
    });

    expect(addAssetQuery).toHaveBeenCalledWith("image/png", "png");

    expect(query).toHaveBeenCalledWith(
      "UPDATE item SET name=?, serial=?, description=?, known_issues=?, shelf=?, user_id=?, asset_id=?, status_id=?, group_id=?, borrowable=?, bookable=? WHERE id=?",
      [
        itemData.name,
        itemData.serial,
        itemData.description,
        itemData.knownIssues,
        itemData.shelf,
        itemData.userId,
        99,
        itemData.statusId,
        itemData.groupId,
        itemData.borrowable,
        itemData.bookable,
        itemData.id,
      ],
    );
  });

  it("does not update the item if creating its new asset fails", async () => {
    addAssetQuery.mockRejectedValue(new Error("Asset creation failed"));

    await expect(
      updateItemQuery({ ...itemData, image }),
    ).rejects.toThrow("Asset creation failed");

    expect(query).not.toHaveBeenCalled();
  });

  it("propagates database errors", async () => {
    query.mockRejectedValue(new Error("Database error"));

    await expect(updateItemQuery(itemData)).rejects.toThrow(
      "Database error",
    );
  });
});

describe("getItemsQuery", () => {
  it("returns the items from item_view", async () => {
    const items = [
      { id: 1, name: "Sensor" },
      { id: 2, name: "Camera" },
    ];
    query.mockResolvedValue(items);

    await expect(getItemsQuery()).resolves.toEqual(items);

    expect(query).toHaveBeenCalledWith("SELECT * FROM item_view");
  });

  it("propagates database errors", async () => {
    query.mockRejectedValue(new Error("Database error"));

    await expect(getItemsQuery()).rejects.toThrow("Database error");
  });
});

describe("getItemStatusMetaQuery", () => {
  it("returns item status metadata", async () => {
    const statuses = [
      { id: 1, name: "Available" },
      { id: 2, name: "On Loan" },
    ];
    query.mockResolvedValue(statuses);

    await expect(getItemStatusMetaQuery()).resolves.toEqual(statuses);

    expect(query).toHaveBeenCalledWith("SELECT * FROM item_status");
  });

  it("propagates database errors", async () => {
    query.mockRejectedValue(new Error("Database error"));

    await expect(getItemStatusMetaQuery()).rejects.toThrow(
      "Database error",
    );
  });
});

describe("setGroupItemsAsUnsortedQuery", () => {
  it("moves the group's items to the unsorted group", async () => {
    const result = { affectedRows: 3 };
    query.mockResolvedValue(result);

    await expect(setGroupItemsAsUnsortedQuery(7)).resolves.toEqual(result);

    expect(query).toHaveBeenCalledWith(
      "UPDATE item SET group_id=1 WHERE group_id=?",
      [7],
    );
  });

  it("propagates database errors", async () => {
    query.mockRejectedValue(new Error("Database error"));

    await expect(setGroupItemsAsUnsortedQuery(7)).rejects.toThrow(
      "Database error",
    );
  });
});

