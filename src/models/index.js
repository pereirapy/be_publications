/* eslint-disable security/detect-non-literal-require */
'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const config = require(__dirname + '/../config/config.js')
const db = {}
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
)

sequelize
  .authenticate()
  // eslint-disable-next-line promise/always-return
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    // eslint-disable-next-line no-console
    console.error('Unable to connect to the database:', err)
  })

// eslint-disable-next-line security/detect-non-literal-fs-filename
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
  })
  .forEach(file => {
    // eslint-disable-next-line security/detect-non-literal-require
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    )
    // eslint-disable-next-line fp/no-mutation
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  // eslint-disable-next-line security/detect-object-injection
  if (db[modelName].associate) {
    // eslint-disable-next-line security/detect-object-injection
    db[modelName].associate(db)
  }
})

// eslint-disable-next-line fp/no-mutation
db.sequelize = sequelize
// eslint-disable-next-line fp/no-mutation
db.Sequelize = Sequelize

module.exports = db
