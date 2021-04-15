'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.createTable('authors', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        firstName: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: false,
          validate: {
            notEmpty: false,
            len: {
              args: [3, 50]
            }
          }
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: false,
          validate: {
            notEmpty: false,
            len: {
              args: [5, 50]
            }
          }
        },
        email: {
          allowNull: true,
          type: Sequelize.STRING,
          unique: true,
          validate: {
            notEmpty: false,
            isEmail: true
          }
        },
        birtyDate: {
          allowNull: false,
          type: Sequelize.DATEONLY
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      }),
      queryInterface.createTable('publications', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: false,
          validate: {
            notEmpty: false,
            len: {
              args: [3, 200]
            }
          }
        },
        body: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        authorId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            key: 'id',
            model: 'authors'
          }
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      })
    ])
  },
  down: queryInterface => {
    return Promise.all([
      queryInterface.dropTable('publications'),
      queryInterface.dropTable('authors')
    ])
  }
}
