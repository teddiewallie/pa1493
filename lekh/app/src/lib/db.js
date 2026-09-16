import mariadb from "mariadb";

console.log(process.env.MARIADB_HOST);

const pool = mariadb.createPool({
  host: process.env.MARIADB_HOST,
  port: 3306,
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
  connectionLimit: 5
});

export default pool;

