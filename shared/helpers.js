/* eslint-disable fp/no-mutation */
const { sequelize } = require('../models')

const {
  split,
  map,
  pipe,
  head,
  last,
  includes,
  trim,
  replace,
  toNumber,
  getOr,
  isEmpty
} = require('lodash/fp')
const { fieldsNoTypeText } = require('./constants/db.constant')

const canUppersequelizeColumn = column =>
  pipe(split('.'), last, replace(/"/gi, ''), data => {
    return !includes(data, fieldsNoTypeText)
  })(column)

const parseColumns = arrayField =>
  pipe(head, trim, split('.'), data =>
    data.length === 2 ? `"${head(data)}"."${last(data)}"` : `"${head(data)}"`
  )(arrayField)

const parseOrderBy = sort =>
  pipe(
    split(','),
    map(field => {
      const arrayField = split(':', field)
      const column = parseColumns(arrayField)
      const order = trim(last(arrayField))
      return sort.length === 1
        ? canUppersequelizeColumn(column)
          ? `UPPER(${column})`
          : column
        : canUppersequelizeColumn(column)
        ? `UPPER(${column}) ${order}`
        : `${column} ${order}`
    })
  )(sort)

const parseQueryParams = query => {
  const sort = getOr('', 'sort', query)
  const order = !isEmpty(sort) ? sequelize.literal(parseOrderBy(sort)) : null
  const filters = JSON.parse(getOr('{}', 'filters', query))
  const currentPage = toNumber(getOr(1, 'currentPage', query))
  const limit = toNumber(getOr(50, 'perPage', query))
  const offset = (currentPage - 1) * limit
  return { offset, limit, order, currentPage, filters }
}

const getPagingData = (data, currentPage, limitPerPage) => {
  const { count: totalItems, rows: list } = data
  const totalRows = Number(totalItems)
  const lastPage = Math.ceil(totalItems / limitPerPage)
  const pagination = {
    perPage: limitPerPage,
    totalRows,
    lastPage,
    currentPage,
    from: currentPage - 1,
    to: currentPage + 1
  }

  return { list, pagination }
}

const callbackSuccessful = (callback, body) =>
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(body),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
  })

const callbackError = (callback, error) =>
  callback(null, {
    statusCode: error.statusCode || 500,
    body: JSON.stringify(error),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
  })

module.exports = {
  parseOrderBy,
  parseQueryParams,
  getPagingData,
  callbackSuccessful,
  callbackError
}
