import pool from "@/lib/db";

const getUsersByEmail = (email) => await pool.query(
  "SELECT id, name, email, password, role_id FROM user WHERE email = ?",
  [email]
);

export {
  getUsersByEmail
};
