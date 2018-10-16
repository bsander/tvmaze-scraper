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
    }).unknown(),
  }).unknown(),
)

const isShowList = (input: any): input is TVMaze.ShowList => {
  const result = Joi.validate(input, showListSchema)
  return result.error == null
}

const isCastList = (input: any): input is TVMaze.CastList => {
  const result = Joi.validate(input, castListSchema)
  return result.error == null
}

export const getShowList = async (page: number): Promise<TVMaze.ShowList> => {
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
