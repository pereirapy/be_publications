const { sequelize, authors, publications } = require('../../models')
const { parseOrderBy } = require('../../shared/helpers')
const { getOr } = require('lodash/fp')

const getAll = async query => {
  const sort = getOr('firstName:ASC', 'sort', query)
  const offset = getOr(0, 'currentPage', query)
  const limit = getOr(50, 'perPage', query)
  const result = await authors.findAll({
    include: { model: publications, as: 'publications', required: false },
    order: sequelize.literal(parseOrderBy(sort)),
    offset,
    subQuery: false,
    limit
  })
  return result
}

const getOne = async id => {
  const result = await authors.findOne({
    include: { model: publications, as: 'publications' },
    where: { id }
  })
  return result
}

const create = async data => {
  const result = await authors.create(JSON.parse(data))
  return result
}

const update = async (id, data) => {
  const result = await authors.update(JSON.parse(data), { where: { id } })
  return result
}

const deleteOne = async id => {
  return await sequelize.transaction(async t => {
    await publications.destroy({ where: { authorId: id }, transaction: t })
    const result = await authors.destroy({ where: { id }, transaction: t })
    return result
  })
}

module.exports = { getAll, getOne, create, update, deleteOne }
