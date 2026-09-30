// https://github.com/mariadb-developers/nodejs-quickstart

import pool from "@/lib/db";
import bcrypt from "bcrypt";

const getUsersByEmailQuery = async (email) => await pool.query(
  "SELECT id, name, email, password, role_id FROM user WHERE email = ?",
  [email]
);

const getAllUsersQuery = async () => await pool.query(
  "SELECT id, name, email, role_id FROM user"
);

const addUserQuery = async (data) => pool.query(
  "INSERT INTO user (name, email, password, role_id) VALUES (?, ?, ?, ?)",
  [data.name, data.email, await bcrypt.hash(data.password, 12), data.maintainer ? 1 : 2]
);

export {
  getAllUsersQuery,
  getUsersByEmailQuery,
  addUserQuery
};

