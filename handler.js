'use strict'
require('dotenv').config()
const authorsController = require('./controllers/authors.controller')
const publicationsController = require('./controllers/publications.controller')

const getAllAuthors = (event, context, callback) =>
  authorsController.getAll(event, context, callback)
const getOneAuthor = (event, context, callback) =>
  authorsController.getOne(event, context, callback)
const createAuthor = (event, context, callback) =>
  authorsController.create(event, context, callback)
const updateAuthor = (event, context, callback) =>
  authorsController.update(event, context, callback)
const deleteOneAuthor = (event, context, callback) =>
  authorsController.deleteOne(event, context, callback)

const getAllPublications = (event, context, callback) =>
  publicationsController.getAll(event, context, callback)
const getFiltersPublications = (event, context, callback) =>
  publicationsController.getFilters(event, context, callback)
const getOnePublication = (event, context, callback) =>
  publicationsController.getOne(event, context, callback)
const createPublication = (event, context, callback) =>
  publicationsController.create(event, context, callback)
const updatePublication = (event, context, callback) =>
  publicationsController.update(event, context, callback)
const deleteOnePublication = (event, context, callback) =>
  publicationsController.deleteOne(event, context, callback)

module.exports = {
  getAllAuthors,
  getOneAuthor,
  createAuthor,
  updateAuthor,
  deleteOneAuthor,
  getAllPublications,
  getFiltersPublications,
  getOnePublication,
  createPublication,
  updatePublication,
  deleteOnePublication
}
