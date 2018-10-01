const Sequelize = require('sequelize')
const db = require('../db')

const Asset = db.define('asset', {
  assetUrl: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})

module.exports = Asset;

