// src/service/item-query.test.js

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({
  default: {
    query: vi.fn(),
  },
}));

vi.mock("./asset-query", () => ({
  addAssetQuery: vi.fn(),
}));

import pool from "@/lib/db";
import { addAssetQuery } from "./asset-query";
import {
  addItemQuery,
  getItemsQuery,
  getItemStatusMetaQuery,
  updateItemQuery,
  addReportQuery,
  setGroupItemsAsUnsortedQuery,
} from "./item-query";

describe("item-query", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("addReportQuery", () => {
    it("adds a report before existing known issues", async () => {
      pool.query.mockResolvedValueOnce([
        { known_issues: "Existing issue" },
      ]);
      pool.query.mockResolvedValueOnce([]);

      await addReportQuery({ id: 10, reportIssue: "New issue" });

      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        "SELECT known_issues FROM item WHERE id=?",
        [10]
      );

      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        "UPDATE item SET known_issues=? WHERE id=?",
        ["New issue\n\nExisting issue", 10]
      );
    });

    it("sets known issues to the report when no issues exist", async () => {
      pool.query.mockResolvedValueOnce([{ known_issues: "" }]);
      pool.query.mockResolvedValueOnce([]);

      await addReportQuery({ id: 10, reportIssue: "New issue" });

      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        "UPDATE item SET known_issues=? WHERE id=?",
        ["New issue", 10]
      );
    });

    it("throws when the item does not exist", async () => {
      pool.query.mockResolvedValueOnce([]);

      await expect(
        addReportQuery({ id: 999, reportIssue: "New issue" })
      ).rejects.toThrow("Item not found.");

      expect(pool.query).toHaveBeenCalledOnce();
    });
  });

  describe("addItemQuery", () => {
    it("creates an asset and inserts the item", async () => {
      addAssetQuery.mockResolvedValueOnce(123);
      pool.query.mockResolvedValueOnce([]);

      const data = {
        name: "Raspberry Pi",
        serial: "RP-001",
        description: "Development board",
        knownIssues: "None",
        shelf: "A1",
        userId: 5,
        statusId: 1,
        groupId: 2,
        borrowable: true,
        bookable: false,
        image: {
          name: "board.PNG",
          type: "image/png",
        },
      };

      const result = await addItemQuery(data);

      expect(addAssetQuery).toHaveBeenCalledWith("image/png", "png");

      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO item (name, serial, description, known_issues, shelf, user_id, asset_id, status_id, group_id, borrowable, bookable) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          "Raspberry Pi",
          "RP-001",
          "Development board",
          "None",
          "A1",
          5,
          123,
          1,
          2,
          true,
          false,
        ]
      );

      expect(result).toEqual({ id: 123, extension: "png" });
    });
  });

  describe("updateItemQuery", () => {
    const data = {
      id: 10,
      name: "Updated item",
      serial: "RP-002",
      description: "Updated description",
      knownIssues: "Updated issue",
      shelf: "B2",
      userId: 7,
      assetId: 456,
      statusId: 2,
      groupId: 3,
      borrowable: false,
      bookable: true,
    };

    it("updates the item and preserves the existing asset when no image is supplied", async () => {
      pool.query.mockResolvedValueOnce([]);

      const result = await updateItemQuery(data);

      expect(addAssetQuery).not.toHaveBeenCalled();

      expect(pool.query).toHaveBeenCalledWith(
        "UPDATE item SET name=?, serial=?, description=?, known_issues=?, shelf=?, user_id=?, asset_id=?, status_id=?, group_id=?, borrowable=?, bookable=? WHERE id=?",
        [
          "Updated item",
          "RP-002",
          "Updated description",
          "Updated issue",
          "B2",
          7,
          456,
          2,
          3,
          false,
          true,
          10,
        ]
      );

      expect(result).toEqual({ id: null, extension: null });
    });

    it("creates a new asset when an image is supplied", async () => {
      addAssetQuery.mockResolvedValueOnce(789);
      pool.query.mockResolvedValueOnce([]);

      const result = await updateItemQuery({
        ...data,
        image: {
          name: "updated.JPG",
          type: "image/jpeg",
        },
      });

      expect(addAssetQuery).toHaveBeenCalledWith("image/jpeg", "jpg");

      expect(pool.query).toHaveBeenCalledWith(
        "UPDATE item SET name=?, serial=?, description=?, known_issues=?, shelf=?, user_id=?, asset_id=?, status_id=?, group_id=?, borrowable=?, bookable=? WHERE id=?",
        [
          "Updated item",
          "RP-002",
          "Updated description",
          "Updated issue",
          "B2",
          7,
          789,
          2,
          3,
          false,
          true,
          10,
        ]
      );

      expect(result).toEqual({ id: 789, extension: "jpg" });
    });
  });

  describe("getItemsQuery", () => {
    it("returns items from item_view", async () => {
      const items = [{ id: 1, name: "Raspberry Pi" }];
      pool.query.mockResolvedValueOnce(items);

      await expect(getItemsQuery()).resolves.toEqual(items);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM item_view"
      );
    });
  });

  describe("getItemStatusMetaQuery", () => {
    it("returns item status metadata", async () => {
      const statuses = [{ id: 1, name: "Available" }];
      pool.query.mockResolvedValueOnce(statuses);

      await expect(getItemStatusMetaQuery()).resolves.toEqual(statuses);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM item_status"
      );
    });
  });

  describe("setGroupItemsAsUnsortedQuery", () => {
    it("moves items in the specified group to group 1", async () => {
      pool.query.mockResolvedValueOnce({ affectedRows: 3 });

      const result = await setGroupItemsAsUnsortedQuery(4);

      expect(pool.query).toHaveBeenCalledWith(
        "UPDATE item SET group_id=1 WHERE group_id=?",
        [4]
      );

      expect(result).toEqual({ affectedRows: 3 });
    });
  });
});
