'use strict'
const tableName = 'publications'

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert(
      tableName,
      [
        {
          title: 'In Search of Lost Time',
          body:
            "Swann's Way, the first part of A la recherche de temps perdu, Marcel Proust's seven-part cycle, was published in 1913. In it, Proust introduces the themes that run through the entire work.",
          authorId: 1,
          createdAt: '2021-04-15 14:27:58',
          updatedAt: '2021-04-15 14:27:58'
        },
        {
          title: 'Ulysses',
          body: `Ulysses is a modernist novel by Irish writer James Joyce. It was first serialized in parts in the American journal The Little Review from March 1918 to December 1920 and then published in its entirety in Paris by Sylvia Beach on 2 February 1922, Joyce's 40th birthday. It is considered one of the most important works of modernist literature[1] and has been called "a demonstration and summation of the entire movement."[2] According to Declan Kiberd, "Before Joyce, no writer of fiction had so foregrounded the process of thinking"`,
          authorId: 2,
          createdAt: '2021-04-10 14:27:58',
          updatedAt: '2021-04-10 14:27:58'
        }
      ],
      {}
    )
    return queryInterface.sequelize.query(
      `ALTER SEQUENCE ${tableName}_id_seq RESTART WITH 3`
    )
  },

  down: queryInterface => {
    return queryInterface.bulkDelete(tableName, null, {
      truncate: true,
      cascade: true
    })
  }
}
