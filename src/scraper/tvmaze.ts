import Joi from 'joi'
import { TVMaze } from '../../types/TVMaze'
import fetch from './resilientFetch'

const TVMAZE_ROOT = 'https://api.tvmaze.com'

const showListSchema = Joi.array().items(
  Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
  }).unknown(),
)

const castListSchema = Joi.array().items(
  Joi.object({
    person: Joi.object({
      id: Joi.number().required(),
      name: Joi.string().required(),
      birthday: Joi.string()
        .allow(null)
        .default(null),
      // birthday: Joi.date().allow(null).default(null),
    }).unknown(),
  }).unknown(),
)

const isShowList = (input: any): input is TVMaze.ShowList => {
  const result = Joi.validate(input, showListSchema)
  // if (result.error) {
  //   console.error({ input, result })
  // }
  return result.error == null
}

const isCastList = (input: any): input is TVMaze.CastList => {
  const result = Joi.validate(input, castListSchema)
  // if (result.error) {
  //   console.error({ input: input[0], result })
  // }
  return result.error == null
}

export const getShowList = async (
  page: number = 0,
): Promise<TVMaze.ShowList> => {
  const url = `${TVMAZE_ROOT}/shows?page=${page}`
  const parsedResponse = await fetch(url)
  if (!isShowList(parsedResponse)) {
    throw new Error('Invalid ShowList Format received!')
  }
  return parsedResponse
}

export const getCastListFromShow = async (
  show: TVMaze.Show,
): Promise<TVMaze.CastList> => {
  const url = `${TVMAZE_ROOT}/shows/${show.id}/cast`
  const parsedResponse = await fetch(url)
  if (!isCastList(parsedResponse)) {
    throw new Error('Invalid CastList Format received!')
  }
  return parsedResponse
}
