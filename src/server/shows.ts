import { ServerRoute } from 'hapi'
import { dissoc, groupBy } from 'ramda'
// import { TVMaze } from '../../types/TVMaze'
import { getCastForShows, getShows } from './db'

export const routes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/shows',
    handler: async () => {
      const shows = await getShows(50, 0)
      const showIds = shows.map((show) => show.id)

      const cast = await getCastForShows(showIds)
      const castMap = groupBy((castMember) => castMember.show_id, cast)
      return shows.map((show) => ({
        ...show,
        cast: (castMap[show.id] || []).map(dissoc('show_id')),
      }))
    },
  },
]
