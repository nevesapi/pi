import mysql from "mysql2/promise";
import "dotenv/config.js";

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.DB_NAME,
});

try {
  const connection = await pool.getConnection();
  console.log(`DB Conectado em: ${connection.config.host}`);
  connection.release();
} catch (erro) {
  console.error(`Erro ao conectar: ${erro.message}`);
}
