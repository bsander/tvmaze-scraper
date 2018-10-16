import * as DotEnv from 'dotenv'
DotEnv.config()

import { insertCastForShow, insertShow } from './db'
import { getCastListFromShow, getShowList } from './tvmaze'

const retrieveShows = async (page: number): Promise<number> => {
  const showList = await getShowList(page)

  const insertOperations = showList.map(async (show) => {
    await insertShow(show)
    const castList = (await getCastListFromShow(show)).map((c) => c.person)
    await insertCastForShow(show, castList)
    console.info(`Stored ${show.name} with ${castList.length} cast members`)
  })
  await Promise.all(insertOperations)

  return showList.length
}

const runScraper = async () => {
  let page: number = 0
  let lastCount = 0
  do {
    console.info(`Processing page ${page}`)
    lastCount = await retrieveShows(page)
    page += 1
  } while (lastCount > 0)
  console.info('Scraping completed.')
}

runScraper()
