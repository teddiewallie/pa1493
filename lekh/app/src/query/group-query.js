import pool from "@/lib/db";

const columns = [
  "name",
  "description",
  "known_issues"
];

const addGroupQuery = async (data) => {
  const result = await pool.query(
    `INSERT INTO item_group (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
    [data.name, data.description, data.knownIssues]
  );

  return { id: result.insertId };
};

const updateGroupQuery = async (data) => {
  const updateColumns = columns.map((column) => `${column}=?`).join(", ");

  await pool.query(
    `UPDATE item_group SET ${updateColumns} WHERE id=?`,
    [data.name, data.description, data.knownIssues, data.id]
  );

  return { id: data.id };
};

const getGroupsQuery = async () => {
  const groups = await pool.query("SELECT * FROM item_group");
  return groups;
};

export {
  addGroupQuery,
  updateGroupQuery,
  getGroupsQuery
};

