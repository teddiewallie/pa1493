// https://github.com/mariadb-developers/nodejs-quickstart

import pool from "@/lib/db";
import { addAssetQuery } from "./asset-query";

const addItemQuery = async (data) => {
  const extension = data.image.name.split(".").pop().toLowerCase();
  const assetId = await addAssetQuery(data.image.type, extension);

  console.log(data);

  await pool.query(
    "INSERT INTO item (name, serial, description, shelf, user_id, asset_id, status_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [data.name, data.serial, data.description, data.shelf, data.userId, assetId, data.statusId]
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
  getItemStatusMetaQuery
};

