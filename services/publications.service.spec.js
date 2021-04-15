const publicationsService = require('./publications.service')
const { publications, authors } = require('../models')
const { first, map, find } = require('lodash/fp')

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

const stubPublications = [
  {
    id: 1,
    title: 'In Search of Lost Time',
    body:
      "Swann's Way, the first part of A la recherche de temps perdu, Marcel Proust's seven-part cycle, was published in 1913. In it, Proust introduces the themes that run through the entire work.",
    authorId: 1
  },
  {
    id: 2,
    title: 'Ulysses',
    body: `Ulysses is a modernist novel by Irish writer James Joyce. It was first serialized in parts in the American journal The Little Review from March 1918 to December 1920 and then published in its entirety in Paris by Sylvia Beach on 2 February 1922, Joyce's 40th birthday. It is considered one of the most important works of modernist literature[1] and has been called "a demonstration and summation of the entire movement."[2] According to Declan Kiberd, "Before Joyce, no writer of fiction had so foregrounded the process of thinking"`,
    authorId: 2
  }
]

beforeAll(async () => {
  return await Promise.all([
    ...map(data => authors.create(data), stubAuthors),
    ...map(data => publications.create(data), stubPublications)
  ])
})

afterAll(async () => {
  return await Promise.all([
    publications.destroy({ truncate: true, cascade: true }),
    authors.destroy({ truncate: true, cascade: true })
  ])
})

describe('Publications Service', () => {
  test('getAll function', async () => {
    expect.assertions(1)
    const publicationsWithAuthors = map(
      publication => ({
        ...publication,
        author: find(author => author.id === publication.authorId, stubAuthors)
      }),
      stubPublications
    )
    const result = await publicationsService.getAll()

    expect(result).toEqual(
      expect.objectContaining({
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
    )
  })

  test('getOne function', async () => {
    expect.assertions(1)
    const result = await publicationsService.getOne(1)
    const publicationWithAuthor = {
      author: first(stubAuthors),
      ...first(stubPublications)
    }

    expect(result).toEqual(expect.objectContaining(publicationWithAuthor))
  })

  test('create function', async () => {
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
  test('update function - one record', async () => {
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
  test('update function - zero record - id not found', async () => {
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
  test('deleteOne function - one record', async () => {
    expect.assertions(1)
    const result = await publicationsService.deleteOne(3)

    expect(result).toEqual(1)
  })
  test('deleteOne function - zero record - id not found', async () => {
    expect.assertions(1)
    const result = await publicationsService.deleteOne(0)

    expect(result).toEqual(0)
  })
})
