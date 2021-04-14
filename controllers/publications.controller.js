const publicationsService = require('../services/publications.service')
const { callbackSuccessful, callbackError } = require('../shared/helpers')

const getAll = async (event, context, callback) => {
  // eslint-disable-next-line fp/no-mutation
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const query = event.queryStringParameters
    const body = await publicationsService.getAll(query)
    callbackSuccessful(callback, body)
  } catch (error) {
    callbackError(callback, error)
  }
}

const getFilters = async (event, context, callback) => {
  // eslint-disable-next-line fp/no-mutation
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const query = event.queryStringParameters
    const body = await publicationsService.getFilters(query)
    callbackSuccessful(callback, body)
  } catch (error) {
    callbackError(callback, error)
  }
}

const getOne = async (event, context, callback) => {
  // eslint-disable-next-line fp/no-mutation
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const id = event.pathParameters.id
    const body = await publicationsService.getOne(id)
    callbackSuccessful(callback, body)
  } catch (error) {
    callbackError(callback, error)
  }
}

const create = async (event, context, callback) => {
  // eslint-disable-next-line fp/no-mutation
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const data = event.body
    const body = await publicationsService.create(data)
    callbackSuccessful(callback, body)
  } catch (error) {
    callbackError(callback, error)
  }
}

const update = async (event, context, callback) => {
  // eslint-disable-next-line fp/no-mutation
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const id = event.pathParameters.id
    const data = event.body
    const body = await publicationsService.update(id, data)
    callbackSuccessful(callback, body)
  } catch (error) {
    callbackError(callback, error)
  }
}

const deleteOne = async (event, context, callback) => {
  // eslint-disable-next-line fp/no-mutation
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const id = event.pathParameters.id
    const body = await publicationsService.deleteOne(id)
    callbackSuccessful(callback, body)
  } catch (error) {
    callbackError(callback, error)
  }
}

module.exports = { getAll, getOne, create, update, deleteOne, getFilters }
