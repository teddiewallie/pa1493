import pool from "@/lib/db";

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
  getArticleTypesQuery
};

