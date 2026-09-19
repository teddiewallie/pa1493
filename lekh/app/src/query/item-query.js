// https://github.com/mariadb-developers/nodejs-quickstart

import pool from "@/lib/db";
import bcrypt from "bcrypt";

const addItemQuery = async (data) => pool.query(
  "INSERT INTO item (name, serial, description, user_id) VALUES (?, ?, ?, ?)",
  [data.name, data.serial, data.description, data.userId]
);

export {
  addItemQuery
};

