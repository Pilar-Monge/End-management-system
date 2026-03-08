import { Pool } from "pg";

export const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "gestionfin",
  password: "gestionfin123",
  database: "gestionfin_db"
});