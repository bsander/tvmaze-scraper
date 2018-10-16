import { insertCastForShow, insertShow } from './db'
import { getCastListFromShow, getShowList } from './tvmaze'

const run = async () => {
  const showList = await getShowList()
  const insertOperations = showList.map(async (show) => {
    await insertShow(show)
    const castList = (await getCastListFromShow(show)).map((c) => c.person)
    await insertCastForShow(show, castList)
    console.info(`Stored ${show.name} with ${castList.length} cast members`)
  })
  await Promise.all(insertOperations)
  console.info('Scraping completed.')
}

run()
