import "dotenv/config";
import pool from "./database.js";

try {
  const [rows] = await pool.query(
    "SELECT DATABASE() AS database_name, NOW() AS server_time"
  );

  console.log("========================================");
  console.log(" DATABASE CONNECTION SUCCESS");
  console.log("========================================");
  console.log("Database:", rows[0].database_name);
  console.log("Server time:", rows[0].server_time);
  console.log("========================================");

  await pool.end();
} catch (error) {
  console.error("========================================");
  console.error(" DATABASE CONNECTION FAILED");
  console.error("========================================");
  console.error(error.message);
  console.error("========================================");

  process.exit(1);
}