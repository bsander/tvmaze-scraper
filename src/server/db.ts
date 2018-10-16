import { Pool } from 'pg'

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_DATABSE,
  DB_PASSWORD,
} = process.env as any // time-related shortcut for not dealing with all values in process.env being optional

const db = new Pool({
  host: DB_HOST,
  user: DB_USER,
  database: DB_DATABSE,
  password: DB_PASSWORD,
  port: DB_PORT,
})

export const getShows = async (limit: number, offset: number) =>
  (await db.query(
    'SELECT shows.show_id AS id, shows.name FROM shows ORDER BY shows.show_id ASC LIMIT $1 OFFSET $2',
    [limit, offset],
  )).rows

export const getCastForShows = async (showIds: number[]) =>
  (await db.query(
    `SELECT show_cast.show_id, "cast".cast_id AS id, "cast".name,
    TO_CHAR("cast".birthday, 'YYYY-MM-DD') as birthday
  FROM "cast"
  INNER JOIN show_cast ON show_cast.cast_id = "cast".cast_id
  WHERE show_cast.show_id = ANY($1::int[])
  ORDER BY show_cast.show_id ASC, "cast".birthday DESC NULLS LAST
`,
    [showIds],
  )).rows
