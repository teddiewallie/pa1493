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
  "group_id"
];

const addReportQuery = async (data) => {
  const { knownIssues, reportIssue } = data;

  const newKnownIssues = `${reportIssue}\n\n${knownIssues}`;

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
    [data.name, data.serial, data.description, data.knownIssues, data.shelf, data.userId, assetId, data.statusId, data.groupId]
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
    [data.name, data.serial, data.description, data.knownIssues, data.shelf, data.userId, assetId ?? data.assetId, data.statusId, data.groupId, data.id]
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

export {
  addItemQuery,
  getItemsQuery,
  getItemStatusMetaQuery,
  updateItemQuery,
  addReportQuery
};

