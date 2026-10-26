import { Pool } from "pg";
import dotenv from "dotenv";
import { getEnv, getEnvNumber } from "../config/env";

dotenv.config();

export const pool = new Pool({
  host: getEnv("DB_HOST"),
  port: getEnvNumber("DB_PORT"),
  database: getEnv("DB_NAME"),
  user: getEnv("DB_USER"),
  password: getEnv("DB_PASSWORD"),
});
