const publicationsService = require('./publications.service')
const { publications, authors } = require('../../models')
const { first, map, find } = require('lodash/fp')
const { stubAuthors, stubPublications } = require('./publications.stub')

const deleteAll = async () =>
  await Promise.all([
    publications.destroy({ truncate: true, cascade: true }),
    authors.destroy({ truncate: true, cascade: true })
  ])

const createData = async () => {
  await Promise.all(map(data => authors.create(data), stubAuthors))
  return await Promise.all(
    map(data => publications.create(data), stubPublications)
  )
}

beforeAll(async () => {
  await deleteAll()
  return await createData()
})

afterAll(async () => await deleteAll())

describe('Publications Service', () => {
  describe('getAll()', () => {
    test('Should return an object with two keys: list and pagination', async () => {
      expect.assertions(1)
      const publicationsWithAuthors = map(
        publication => ({
          ...publication,
          author: expect.objectContaining(
            find(author => author.id === publication.authorId, stubAuthors)
          )
        }),
        stubPublications
      )

      const valueExpected = expect.objectContaining({
        list: expect.arrayContaining([
          expect.objectContaining(publicationsWithAuthors[0]),
          expect.objectContaining(publicationsWithAuthors[1])
        ]),
        pagination: expect.objectContaining({
          currentPage: 1,
          from: 0,
          perPage: 50,
          lastPage: 1,
          to: 2,
          totalRows: 2
        })
      })

      const result = await publicationsService.getAll()

      expect(result).toEqual(valueExpected)
    })
    test('Should return an object with two keys: list empty and pagination', async () => {
      expect.assertions(1)
      await deleteAll()
      const expectedData = expect.objectContaining({
        list: [],
        pagination: expect.objectContaining({
          currentPage: 1,
          from: 0,
          perPage: 50,
          lastPage: 0,
          to: 2,
          totalRows: 0
        })
      })

      const result = await publicationsService.getAll()

      expect(result).toEqual(expectedData)
      await createData()
    })
  })

  describe('getOne()', () => {
    test('Should return an object with all columns of the publications table', async () => {
      expect.assertions(1)
      const publicationWithAuthor = {
        author: expect.objectContaining(first(stubAuthors)),
        ...first(stubPublications)
      }
      const result = await publicationsService.getOne(1)
      expect(result).toEqual(expect.objectContaining(publicationWithAuthor))
    })
  })

  describe('create()', () => {
    test('Should return an object with the data was created', async () => {
      expect.assertions(1)
      const newPublication = {
        id: 3,
        title: 'new title',
        body: 'new body',
        authorId: 1
      }

      const result = await publicationsService.create(
        JSON.stringify(newPublication)
      )

      expect(result).toEqual(expect.objectContaining(newPublication))
    })
    test('Should return an error because the author id was not found', async () => {
      expect.assertions(1)
      const newPublication = {
        id: 4,
        title: 'new title',
        body: 'new body',
        authorId: 0
      }
      try {
        await publicationsService.create(JSON.stringify(newPublication))
      } catch (error) {
        expect(error).toEqual(
          expect.objectContaining({ index: 'publications_authorId_fkey' })
        )
      }
    })
  })

  describe('update()', () => {
    test('Should return the number 1 because just one record was updated', async () => {
      expect.assertions(1)
      const updatePublication = {
        id: 3,
        title: 'new title updated',
        body: 'new body updated',
        authorId: 1
      }

      const result = await publicationsService.update(
        updatePublication.id,
        JSON.stringify(updatePublication)
      )

      expect(result).toEqual([1])
    })
    test('Should return the number 0 because the id was not found', async () => {
      expect.assertions(1)
      const updatePublication = {
        id: 0,
        title: 'new title updated 2',
        body: 'new body updated 2',
        authorId: 1
      }

      const result = await publicationsService.update(
        updatePublication.id,
        JSON.stringify(updatePublication)
      )

      expect(result).toEqual([0])
    })
  })

  describe('deleteOne()', () => {
    test('Should return the number 1 because just one record was deleted', async () => {
      expect.assertions(1)
      const result = await publicationsService.deleteOne(3)

      expect(result).toEqual(1)
    })
    test('Should return the number 0 because the id was not found', async () => {
      expect.assertions(1)
      const result = await publicationsService.deleteOne(0)

      expect(result).toEqual(0)
    })
  })
})
