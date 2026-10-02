// https://github.com/mariadb-developers/nodejs-quickstart

import pool from "@/lib/db";

const columns = [
  "id",
  "name",
  "serial",
  "description"
];

const getGroupsQuery = async () => {
  const groups = await pool.query("SELECT * FROM item_group");
  return groups;
};

export {
  getGroupsQuery
};

