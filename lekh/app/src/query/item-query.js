// https://github.com/mariadb-developers/nodejs-quickstart

import pool from "@/lib/db";
import { addAssetQuery } from "./asset-query";

const addItemQuery = async (data) => {
  const extension = data.image.name.split(".").pop().toLowerCase();
  const assetId = await addAssetQuery(data.image.type, extension);

  await pool.query(
    "INSERT INTO item (name, serial, description, user_id, asset_id) VALUES (?, ?, ?, ?, ?)",
    [data.name, data.serial, data.description, data.userId, assetId]
  );

  return { id: assetId, extension };
};

const getItemsQuery = async () => {
  const items = await pool.query("SELECT * FROM item_view");
  return items;
};

export {
  addItemQuery,
  getItemsQuery
};

