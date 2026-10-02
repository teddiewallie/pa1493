// https://github.com/mariadb-developers/nodejs-quickstart

import pool from "@/lib/db";
import bcrypt from "bcrypt";

const columns = [
  "name",
  "email",
  "role_id"
];

const getUsersByEmailQuery = async (email) => await pool.query(
  "SELECT id, name, email, password, role_id FROM user WHERE email = ?",
  [email]
);

const getUsersByIdQuery = async (id) => await pool.query(
  "SELECT id, name, email, role_id FROM user WHERE id = ?",
  [id]
);

const getAllUsersQuery = async () => await pool.query(
  "SELECT id, name, email, role_id FROM user"
);

const addUserQuery = async (data) =>{
  const addColumns = [...columns];
  addColumns.splice(addColumns.length - 1, 0, "password");

  await pool.query(
    `INSERT INTO user (${addColumns.join(", ")}) VALUES (${addColumns.map(() => "?").join(", ")})`,
    [data.name, data.email, await bcrypt.hash(data.password, 12), data.maintainer ? 1 : 2]
  );
}

const updateUserQuery = async (data, isAdmin) => {
  const updateColumns = [...columns];

  const dataColumns = [
    data.name,
    data.email,
    2,
    data.id
  ];

  if (data.maintainer && isAdmin) {
    dataColumns[2] = 1;
  }

  if (data.password?.length > 0) {
    const hashedPassword = await bcrypt.hash(data.password, 12);

    updateColumns.splice(updateColumns.length - 1, 0, "password");
    dataColumns.splice(dataColumns.length - 2, 0, hashedPassword);
  }

  const mapUpdateColumns = updateColumns.map((column) => `${column}=?`).join(", ");

  await pool.query(`UPDATE user SET ${mapUpdateColumns} WHERE id=?`, dataColumns);

  return true;
};

export {
  getAllUsersQuery,
  getUsersByEmailQuery,
  getUsersByIdQuery,
  addUserQuery,
  updateUserQuery
};

