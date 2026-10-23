// Diffs in the link below are ChatGPT assisted
// https://github.com/dipt-pa1493-ht26/pa1493-tewa25-lekh-zda/pull/181/changes

// https://github.com/mariadb-developers/nodejs-quickstart

import pool from "@/lib/db";
import { addAssetQuery } from "./asset-query";

const columns = [
  "name",
  "serial",
  "description",
  "known_issues",
  "shelf",
  "user_id",
  "asset_id",
  "status_id",
  "group_id",
  "borrowable",
  "bookable"
];

const addReportQuery = async (data) => {
  const { id, reportIssue } = data;

  const rows = await pool.query(
    "SELECT known_issues FROM item WHERE id=?",
    [id]
  );

  if (rows.length === 0) {
    throw new Error("Item not found.");
  }

  const knownIssues = rows[0].known_issues;
  console.log(knownIssues);

  const newKnownIssues = knownIssues === ""
  ? `${reportIssue}`
  : `${reportIssue}\n\n${knownIssues}`;

  await pool.query(
    "UPDATE item SET known_issues=? WHERE id=?",
    [newKnownIssues, data.id]
  );
};

const addItemQuery = async (data) => {
  const extension = data.image.name.split(".").pop().toLowerCase();
  const assetId = await addAssetQuery(data.image.type, extension);

  await pool.query(
    `INSERT INTO item (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
    [
      data.name,
      data.serial,
      data.description,
      data.knownIssues,
      data.shelf,
      data.userId,
      assetId,
      data.statusId,
      data.groupId,
      data.borrowable,
      data.bookable
    ]
  );

  return { id: assetId, extension };
};

const updateItemQuery = async (data) => {
  let extension = null;
  let assetId = null;

  if (data.image) {
    extension = data.image.name.split(".").pop().toLowerCase();
    assetId = await addAssetQuery(data.image.type, extension);
  }

  const updateColumns = columns.map((column) => `${column}=?`).join(", ");

  await pool.query(
    `UPDATE item SET ${updateColumns} WHERE id=?`,
    [
      data.name,
      data.serial,
      data.description,
      data.knownIssues,
      data.shelf,
      data.userId,
      assetId ?? data.assetId,
      data.statusId,
      data.groupId,
      data.borrowable,
      data.bookable,
      data.id
    ]
  );

  return { id: assetId, extension };
};

const getItemsQuery = async () => {
  const items = await pool.query("SELECT * FROM item_view");
  return items;
};

const getItemStatusMetaQuery = async () => {
  const statusMeta = await pool.query("SELECT * FROM item_status");
  return statusMeta;
};

const setGroupItemsAsUnsortedQuery = async (id) => await pool.query(
  "UPDATE item SET group_id=1 WHERE group_id=?", [id]
);

export {
  addItemQuery,
  getItemsQuery,
  getItemStatusMetaQuery,
  updateItemQuery,
  addReportQuery,
  setGroupItemsAsUnsortedQuery
};

