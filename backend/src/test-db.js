import dotenv from "dotenv";
dotenv.config();

import pool from "./config/db.js";

async function test() {
  console.log("DB_USER =", process.env.DB_USER);
  console.log("DB_PASSWORD =", process.env.DB_PASSWORD);

  const res = await pool.query("SELECT NOW()");
  console.log("✅ DB CONNECTED:", res.rows[0]);
  process.exit(0);
}

test();
