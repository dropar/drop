const Sequelize = require('sequelize')
const db = require('../db')

const Asset = db.define('asset', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  thumbnail: {
    type: Sequelize.STRING,
    allowNull: false
  },
  assetUrl: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Asset
