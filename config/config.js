/* eslint-disable security/detect-object-injection */
'use strict'

require('dotenv').config()
const env = process.env.CURRENT_ENVIRONMENT || 'development'

const variablesEnvironment = {
  development: {
    dialect: 'postgres',
    database: process.env.DATABASE,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    define: {
      charset: 'utf8',
      dialectOptions: { collate: 'utf8_general_ci' }
    },
    port: 5432,
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeData',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    dialect: 'postgres',
    database: process.env.DATABASE,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: 5432,
    define: {
      charset: 'utf8',
      dialectOptions: { collate: 'utf8_general_ci' }
    },
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeData',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
}

// eslint-disable-next-line no-console
console.log('Configation loaded of the environment: ' + env)

module.exports = variablesEnvironment[env]
