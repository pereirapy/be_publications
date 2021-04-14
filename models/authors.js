/* eslint-disable fp/no-mutation */
'use strict'

module.exports = (sequelize, DataTypes) => {
  const authors = sequelize.define(
    'authors',
    {
      firstName: {
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
        unique: true,
        validate: {
          notEmpty: false,
          isEmail: true
        }
      },
      birtyDate: {
        allowNull: false,
        type: DataTypes.DATEONLY
      }
    },
    {
      tableName: 'authors'
    }
  )

  authors.associate = models => {
    authors.hasMany(models.publications, {
      as: 'publications'
    })
  }

  return authors
}
