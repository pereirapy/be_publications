require('dotenv').config()
const url = `http://${process.env.HOST_TEST}:${process.env.PORT_TEST}/${process.env.STAGE_TEST}`
const request = require('supertest')(url)
const { publications, authors } = require('../../models')
const { stubAuthors, stubPublications } = require('./publications.stub')
const { first, map, find } = require('lodash/fp')

const uri = '/publications'

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

describe('/publications', () => {
  describe('GET ', () => {
    it('responds with aan object with two keys: list and pagination', () => {
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

      return request
        .get(uri)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response).toBeDefined()
          expect(response.body).toEqual(valueExpected)
        })
    })

    it('responds with an empty array', async () => {
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

      return request
        .get(uri)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response).toBeDefined()
          expect(response.body).toEqual(expectedData)
        })
    })
  })

  describe('GET /?', () => {
    it('responds with an object', async () => {
      await createData()
      const publicationWithAuthor = {
        author: expect.objectContaining(first(stubAuthors)),
        ...first(stubPublications)
      }

      return request
        .get(`${uri}/1`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response).toBeDefined()
          expect(response.body).toEqual(
            expect.objectContaining(publicationWithAuthor)
          )
        })
    })

    it('responds with an empty object because the id is not found', async () => {
      return request
        .get(`${uri}/0`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response).toBeDefined()
          expect(response.body).toEqual(null)
        })
    })
  })

  describe('POST ', () => {
    it('responds with an object with the data was created', async () => {
      const newPublication = {
        id: 3,
        title: 'new title',
        body: 'new body',
        authorId: 1
      }

      return request
        .post(`${uri}`)
        .send(newPublication)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response).toBeDefined()
          expect(response.body).toEqual(expect.objectContaining(newPublication))
        })
    })

    it('responds with an error because the author id was not found', async () => {
      const newPublication = {
        id: 4,
        title: 'new title',
        body: 'new body',
        authorId: 0
      }

      return request
        .post(`${uri}`)
        .send(newPublication)
        .expect('Content-Type', /json/)
        .expect(500)
        .then(response => {
          expect(response).toBeDefined()
          expect(response.body).toEqual(
            expect.objectContaining({ index: 'publications_authorId_fkey' })
          )
        })
    })
  })

  describe('PUT /?', () => {
    it('responds with an array with the number 1 because just one record was updated', async () => {
      const updatePublication = {
        id: 1,
        title: 'new title updated',
        body: 'new body updated',
        authorId: 1
      }

      return request
        .put(`${uri}/1`)
        .send(updatePublication)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response).toBeDefined()
          expect(response.body).toEqual([1])
        })
    })

    it('responds with the number 0 because the id was not found', async () => {
      const updatePublication = {
        title: 'new title updated',
        body: 'new body updated',
        authorId: 1
      }

      return request
        .put(`${uri}/0`)
        .send(updatePublication)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response).toBeDefined()
          expect(response.body).toEqual([0])
        })
    })
  })

  describe('DELETE /?', () => {
    it('responds with the number 1 because just one record was updated', async () => {
      return request
        .delete(`${uri}/1`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response).toBeDefined()
          expect(response.body).toEqual(1)
        })
    })

    it('responds with the number 0 because the id was not found', async () => {
      return request
        .delete(`${uri}/0`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response).toBeDefined()
          expect(response.body).toEqual(0)
        })
    })
  })
})
