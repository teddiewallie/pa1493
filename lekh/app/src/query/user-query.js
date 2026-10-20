// src/query/user-query.js

import pool from "@/lib/db";
import bcrypt from "bcrypt";

const getUsersByEmailQuery = async (email) =>
  await pool.query(
    "SELECT id, name, email, password, role_id FROM user WHERE email=? AND deleted=FALSE",
    [email]
  );

const getUsersByIdQuery = async (id) =>
  await pool.query(
    "SELECT id, name, email, role_id FROM user WHERE id=? AND deleted=FALSE",
    [id]
  );

const getAllUsersQuery = async () =>
  await pool.query(
    "SELECT id, name, email, deleted, role_id FROM user WHERE deleted=FALSE"
  );

const addUserQuery = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 12);
  const roleId = data.maintainer ? 1 : 2;

  await pool.query(
    "INSERT INTO user (name, email, password, role_id) VALUES (?, ?, ?, ?)",
    [data.name, data.email, hashedPassword, roleId]
  );
};

const updateUserQuery = async (data, isAdmin) => {
  // Verify that the target user exists and get their current role.
  const users = await pool.query(
    "SELECT id, role_id FROM user WHERE id=? AND deleted=FALSE",
    [data.id]
  );

  if (users.length === 0) {
    throw new Error("User not found.");
  }

  const currentRoleId = users[0].role_id;
  let roleId = currentRoleId;

  // Only an admin can promote a user to maintainer.
  if (data.maintainer && isAdmin) {
    roleId = 1;
  }

  // A maintainer can be demoted only if another maintainer remains.
  if (!data.maintainer && currentRoleId === 1) {
    const admins = await pool.query(
      "SELECT id FROM user WHERE role_id=1 AND deleted=0"
    );

    if (admins.length <= 1) {
      throw new Error("Can't demote last elevated user.");
    }

    roleId = 2;
  }

  const values = [data.name, data.email];

  let sql = "UPDATE user SET name=?, email=?";

  if (data.password?.length > 0) {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    sql += ", password=?";
    values.push(hashedPassword);
  }

  sql += ", role_id=? WHERE id=?";
  values.push(roleId, data.id);

  await pool.query(sql, values);

  return true;
};

const deleteUserQuery = async (id) => {
  const admins = await pool.query(
    "SELECT id FROM user WHERE role_id=1 AND deleted=0"
  );

  if (admins.length === 1 && admins[0].id === id) {
    throw new Error("Can't delete last elevated user.");
  }

  const users = await pool.query(
    "SELECT id FROM user WHERE id=? AND deleted=FALSE",
    [id]
  );

  if (users.length === 0) {
    throw new Error("User not found.");
  }

  await pool.query(
    "UPDATE user SET deleted=? WHERE id=?",
    [1, id]
  );
};

export {
  getAllUsersQuery,
  getUsersByEmailQuery,
  getUsersByIdQuery,
  addUserQuery,
  updateUserQuery,
  deleteUserQuery,
};

