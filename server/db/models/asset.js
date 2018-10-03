const Sequelize = require('sequelize')
const db = require('../db')

const Asset = db.define('asset', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  thumbnail: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  assetUrl: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})

module.exports = Asset;

