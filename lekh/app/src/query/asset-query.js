import pool from "@/lib/db";

const addAssetQuery = async (mimeType, extension) => {
  const result = await pool.query(
    "INSERT INTO asset (mime_type, extension) VALUES (?, ?)",
    [mimeType, extension]
  );

  return result.insertId;
};

export {
  addAssetQuery
};
