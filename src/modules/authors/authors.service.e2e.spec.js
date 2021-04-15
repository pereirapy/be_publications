require('dotenv').config()
const url = `http://${process.env.HOST_TEST}:${process.env.PORT_TEST}/${process.env.STAGE_TEST}`
const request = require('supertest')(url)
const { authors } = require('../../models')
const { stubAuthors } = require('./authors.stub')
const { first, map } = require('lodash/fp')

const uri = '/authors'

const deleteAll = async () =>
  await authors.destroy({ truncate: true, cascade: true })

const createData = async () =>
  await Promise.all(map(data => authors.create(data), stubAuthors))

beforeAll(async () => {
  await deleteAll()
  return await createData()
})

afterAll(async () => await deleteAll())

describe('/authors', () => {
  describe('GET ', () => {
    it('responds with 2 items array', () => {
      return request
        .get(uri)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response).toBeDefined()
          expect(response.body).toHaveLength(2)
        })
    })

    it('responds with an empty array', async () => {
      await deleteAll()

      return request
        .get(uri)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response).toBeDefined()
          expect(response.body).toHaveLength(0)
        })
    })
  })

  describe('GET /?', () => {
    it('responds with an object', async () => {
      await createData()

      return request
        .get(`${uri}/1`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response).toBeDefined()
          expect(response.body).toEqual(
            expect.objectContaining(first(stubAuthors))
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
      const newAuthor = {
        firstName: 'Two',
        lastName: 'lastName',
        email: 'two@hotmail.com',
        birtyDate: '1914-01-01'
      }

      return request
        .post(`${uri}`)
        .send(newAuthor)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response).toBeDefined()
          expect(response.body).toEqual(expect.objectContaining(newAuthor))
        })
    })
  })

  describe('PUT /?', () => {
    it('responds with an array with the number 1 because just one record was updated', async () => {
      const authorUpdated = {
        firstName: 'One UPDATED',
        lastName: 'lastName UPDATED',
        email: 'one@hotmail.com.updated',
        birtyDate: '1914-01-01'
      }

      return request
        .put(`${uri}/1`)
        .send(authorUpdated)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response).toBeDefined()
          expect(response.body).toEqual([1])
        })
    })

    it('responds with the number 0 because the id was not found', async () => {
      const authorUpdated = {
        firstName: 'One UPDATED',
        lastName: 'lastName UPDATED',
        email: 'one@hotmail.com.updated',
        birtyDate: '1914-01-01'
      }

      return request
        .put(`${uri}/0`)
        .send(authorUpdated)
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
