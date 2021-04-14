const { sequelize, authors, publications } = require('../models')
const { parseQueryParams } = require('../shared/helpers')

const getAll = async query => {
  const { offset, limit, order } = parseQueryParams(query)
  const result = await authors.findAll({
    include: { model: publications, as: 'publications' },
    order,
    offset,
    limit
  })
  return JSON.stringify(result)
}

const getOne = async id => {
  const result = await authors.findOne({
    include: { model: publications, as: 'publications' },
    where: { id }
  })
  return JSON.stringify(result)
}

const create = async data => {
  const result = await authors.create(JSON.parse(data))
  return JSON.stringify(result)
}

const update = async (id, data) => {
  const result = await authors.update(JSON.parse(data), { where: { id } })
  return JSON.stringify(result)
}

const deleteOne = async id => {
  return await sequelize.transaction(async t => {
    await publications.destroy({ where: { authorId: id }, transaction: t })
    const result = await authors.destroy({ where: { id }, transaction: t })
    return JSON.stringify(result)
  })
}

module.exports = { getAll, getOne, create, update, deleteOne }
