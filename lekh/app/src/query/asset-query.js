import pool from "@/lib/db";

const addAssetQuery = async (mimeType, extension) => {
  const result = await pool.query(
    "INSERT INTO asset (mime_type, extension) VALUES (?, ?)",
    [mimeType, extension]
  );

  return result.insertId;
};

const getAssetQuery = async(id) => {
  const result = await pool.query("SELECT mime_type, extension FROM asset WHERE id=?", [id]);

  return result[0];
};

const removeAssetQuery = async(id) => {
  await pool.query("DELETE FROM asset WHERE id=?", [id]);
};

export {
  addAssetQuery,
  getAssetQuery,
  removeAssetQuery
};
