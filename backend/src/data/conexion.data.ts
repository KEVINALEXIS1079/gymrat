
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config({ path: 'src/env/.env' });

export const pool = new Pool({
    host: process.env.SD_HOST,
    user: process.env.SD_USER,
    password: process.env.SD_PASSWORD,
    port: process.env.SD_PORT ? Number(process.env.SD_PORT) : undefined,
    database: process.env.SD_DATABASE,
});