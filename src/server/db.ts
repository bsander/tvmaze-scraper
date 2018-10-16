import { Pool } from 'pg'

const db = new Pool({
  host: 'localhost',
  user: 'tvmaze_app',
  database: 'tvmaze_content',
  password: 'tvmaze',
  port: 5432,
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
