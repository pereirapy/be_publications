const authorsService = require('./authors.service')
const { authors } = require('../../models')
const { first, map, last } = require('lodash/fp')
const { stubAuthors } = require('./authors.stub')

const deleteAll = async () =>
  await authors.destroy({ truncate: true, cascade: true })

const createData = async () =>
  await Promise.all(map(data => authors.create(data), stubAuthors))

beforeAll(async () => {
  await deleteAll()
  return await createData()
})

afterAll(async () => await deleteAll())

describe('Authors Service', () => {
  describe('getAll()', () => {
    test('Should return an array with all data on the table', async () => {
      expect.assertions(1)
      const authorsWithPublications = map(
        author => ({
          ...author,
          publications: []
        }),
        stubAuthors
      )
      const result = await authorsService.getAll()

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining(first(authorsWithPublications)),
          expect.objectContaining(last(authorsWithPublications))
        ])
      )
    })

    test('Should return an array empty', async () => {
      expect.assertions(1)
      await deleteAll()
      const result = await authorsService.getAll()

      expect(result).toEqual([])
      await createData()
    })
  })

  describe('getOne()', () => {
    test('Should return an object with all columns of the authors table', async () => {
      expect.assertions(1)
      const authorsWithPublications = {
        ...first(stubAuthors),
        publications: []
      }
      const result = await authorsService.getOne(1)

      expect(result).toEqual(expect.objectContaining(authorsWithPublications))
    })
  })

  describe('create()', () => {
    test('Should return an object with the data was created', async () => {
      expect.assertions(1)
      const newAuthor = {
        id: 3,
        firstName: 'Two',
        lastName: 'lastName',
        email: 'two@hotmail.com',
        birtyDate: '1914-01-01'
      }

      const result = await authorsService.create(JSON.stringify(newAuthor))

      expect(result).toEqual(expect.objectContaining(newAuthor))
    })
  })

  describe('update()', () => {
    test('Should return an array with the number 1 because just one record was updated', async () => {
      expect.assertions(1)
      const updateAuthor = {
        id: 3,
        firstName: 'Two updated',
        lastName: 'lastName updated',
        email: 'two@hotmail.com.updated',
        birtyDate: '1915-01-01'
      }

      const result = await authorsService.update(
        updateAuthor.id,
        JSON.stringify(updateAuthor)
      )

      expect(result).toEqual([1])
    })

    test('Should return the number 0 because the id was not found', async () => {
      expect.assertions(1)
      const updateAuthor = {
        id: 0,
        firstName: 'Two updated',
        lastName: 'lastName updated',
        email: 'two@hotmail.com.updated',
        birtyDate: '1915-01-01'
      }

      const result = await authorsService.update(
        updateAuthor.id,
        JSON.stringify(updateAuthor)
      )

      expect(result).toEqual([0])
    })
  })

  describe('deleteOne()', () => {
    test('Should return the number 1 because just one record was deleted', async () => {
      expect.assertions(1)
      const result = await authorsService.deleteOne(3)

      expect(result).toEqual(1)
    })
    test('Should return the number 0 because the id was not found', async () => {
      expect.assertions(1)
      const result = await authorsService.deleteOne(0)

      expect(result).toEqual(0)
    })
  })
})
