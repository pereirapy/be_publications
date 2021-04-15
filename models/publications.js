/* eslint-disable fp/no-mutation */
'use strict'

module.exports = (sequelize, DataTypes) => {
  const publications = sequelize.define(
    'publications',
    {
      title: {
        type: DataTypes.STRING,
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
        type: DataTypes.TEXT,
        allowNull: false
      },
      authorId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          key: 'id',
          model: 'authors'
        }
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      tableName: 'publications'
    }
  )

  publications.associate = models => {
    publications.belongsTo(models.authors, {
      foreignKey: 'authorId',
      as: 'author'
    })
  }

  return publications
}
