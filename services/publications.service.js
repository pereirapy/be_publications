const { authors: authorsModel, publications } = require('../models')
const { parseQueryParams, getPagingData } = require('../shared/helpers')
const { getOr, isEmpty } = require('lodash/fp')
const { Op } = require('sequelize')

const getAll = async query => {
  const { offset, limit, order, currentPage, filters } = parseQueryParams(query)
  const authors = getOr([], 'authors', filters)
  const authorsWhere =
    authors.length > 0 ? { authorId: { [Op.in]: authors } } : {}
  const title = getOr('', 'title', filters)
  const titleWhere = !isEmpty(title)
    ? { title: { [Op.like]: `%${title}%` } }
    : {}
  const where = {
    ...authorsWhere,
    ...titleWhere
  }
  const data = await publications.findAndCountAll({
    include: { model: authorsModel, as: 'author' },
    where,
    order,
    offset,
    limit
  })
  const result = getPagingData(data, currentPage, limit)
  return result
}

const getFilters = async () => {
  const authors = await publications.findAll({
    attributes: ['authorId'],
    include: {
      model: authorsModel,
      as: 'author',
      attributes: ['firstName', 'lastName']
    },
    group: ['authorId', 'author.id', 'author.firstName', 'author.lastName']
  })
  const filters = { authors }
  return filters
}

const getOne = async id => {
  const result = await publications.findOne({
    include: { model: authorsModel, as: 'author' },
    where: { id }
  })
  return result
}

const create = async data => {
  const result = await publications.create(JSON.parse(data))
  return result
}

const update = async (id, data) => {
  const result = await publications.update(JSON.parse(data), {
    where: { id }
  })
  return result
}

const deleteOne = async id => {
  const result = await publications.destroy({ where: { id } })
  return result
}

module.exports = { getAll, getOne, create, update, deleteOne, getFilters }
