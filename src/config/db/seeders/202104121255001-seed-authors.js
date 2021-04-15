'use strict'
const tableName = 'authors'

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert(
      tableName,
      [
        {
          id: 1,
          firstName: 'Marcel',
          lastName: 'Proust',
          email: 'marcel@hotmail.com',
          birtyDate: '1900-07-11',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          firstName: 'James',
          lastName: 'Joyce',
          email: 'james@hotmail.com',
          birtyDate: '1901-07-06',
          createdAt: new Date(),
          updatedAt: new Date()
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
