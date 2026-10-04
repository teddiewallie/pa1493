import pool from "@/lib/db";

const columns = [
  "title",
  "content",
  "user_id",
  "item_id",
  "group_id",
  "type_id"
];

const addArticleQuery = async (data) => {
  const result = await pool.query(
    `INSERT INTO article (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
    [data.title, data.content, data.userId, data.itemId, data.groupId, data.typeId]
  );

  return { id: result.insertId };
};

const updateArticleQuery = async (data) => {
  const updateColumns = columns.map((column) => `${column}=?`).join(", ");

  await pool.query(
    `UPDATE article SET ${updateColumns} WHERE id=?`,
    [data.title, data.content, data.userId, data.itemId, data.groupId, data.typeId, data.id]
  );
};

const getArticleTypesQuery = async () => {
  const groups = await pool.query("SELECT * FROM article_type");
  return groups;
}

const getArticlesQuery = async () => {
  const groups = await pool.query("SELECT * FROM article");
  return groups;
};

export {
  getArticlesQuery,
  getArticleTypesQuery,
  addArticleQuery,
  updateArticleQuery
};

