const authorsService = require('./authors.service')
const { authors } = require('../models')
const { first, map, last } = require('lodash/fp')
const stubAuthors = [
  {
    id: 1,
    firstName: 'James',
    lastName: 'Joyce',
    email: 'james@hotmail.com',
    birtyDate: '1901-07-06'
  },
  {
    id: 2,
    firstName: 'Marcel',
    lastName: 'Proust',
    email: 'marcel@hotmail.com',
    birtyDate: '1900-07-11'
  }
]

beforeAll(async () => {
  return await Promise.all(map(data => authors.create(data), stubAuthors))
})

afterAll(() => {
  return authors.destroy({ truncate: true, cascade: true })
})

describe('Authors Service', () => {
  test('getAll function', async () => {
    expect.assertions(1)
    const result = await authorsService.getAll()
    const authorsWithPublications = map(
      author => ({
        ...author,
        publications: []
      }),
      stubAuthors
    )
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining(first(authorsWithPublications)),
        expect.objectContaining(last(authorsWithPublications))
      ])
    )
  })

  test('getOne function', async () => {
    expect.assertions(1)
    const result = await authorsService.getOne(1)
    const authorsWithPublications = {
      ...first(stubAuthors),
      publications: []
    }

    expect(result).toEqual(expect.objectContaining(authorsWithPublications))
  })
  test('create function', async () => {
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
  test('update function - one record', async () => {
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
  test('update function - zero record - id not found', async () => {
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
  test('deleteOne function - one record', async () => {
    expect.assertions(1)
    const result = await authorsService.deleteOne(3)

    expect(result).toEqual(1)
  })
  test('deleteOne function - zero record - id not found', async () => {
    expect.assertions(1)
    const result = await authorsService.deleteOne(0)

    expect(result).toEqual(0)
  })
})
