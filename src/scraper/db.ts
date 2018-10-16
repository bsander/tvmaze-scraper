import { Pool } from 'pg'
import { TVMaze } from '../../types/TVMaze'

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

export const insertShow = async (show: TVMaze.Show): Promise<void> => {
  const { id, name } = show
  await db.query(
    'INSERT INTO public.shows (show_id, name) VALUES ($1, $2) ON CONFLICT (show_id) DO NOTHING',
    [id, name],
  )
}

export const insertCastForShow = async (
  show: TVMaze.Show,
  castList: TVMaze.CastMember[],
): Promise<void> => {
  const { id: showId } = show
  await Promise.all(
    castList.map(async (cast) => {
      const { id, name, birthday } = cast
      await db.query(
        'INSERT INTO public."cast" (cast_id, name, birthday) VALUES ($1, $2, $3) ON CONFLICT (cast_id) DO NOTHING',
        [id, name, birthday],
      )
      await db.query(
        'INSERT INTO public.show_cast (show_id, cast_id) VALUES ($1, $2) ON CONFLICT (show_id, cast_id) DO NOTHING',
        [showId, id],
      )
    }),
  )
}
