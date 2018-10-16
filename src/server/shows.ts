import { notFound } from 'boom'
import { Lifecycle, ServerRoute } from 'hapi'
import { dissoc, groupBy } from 'ramda'
import { TVMaze } from '../../types/TVMaze'
import { getCastForShows, getShows } from './db'

const SHOWS_PER_PAGE = 50

type ApiResponse = Array<TVMaze.Show & { cast: TVMaze.CastMember[] }>

const determinePagerParams = (page: number) => ({
  limit: SHOWS_PER_PAGE,
  offset: (page - 1) * SHOWS_PER_PAGE,
})

const showListHandler: Lifecycle.Method = async (request) => {
  const { page } = request.params
  const { limit, offset } = determinePagerParams(parseInt(page, 10) || 1)

  const shows = await getShows(limit, offset)
  const showIds = shows.map((show) => show.id)

  const cast = await getCastForShows(showIds)
  const castMap = groupBy((castMember) => castMember.show_id, cast)
  const result: ApiResponse = shows.map((show) => ({
    ...show,
    cast: (castMap[show.id] || []).map(dissoc('show_id')),
  }))

  return result.length ? result : notFound('No more shows available')
}

export const routes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/shows',
    handler: (_request, h) => h.redirect('/shows/1'),
  },
  {
    method: 'GET',
    path: '/shows/{page}',
    handler: showListHandler,
  },
]
