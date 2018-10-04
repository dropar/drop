const Sequelize = require('sequelize')
const db = require('../db')

const Asset = db.define('asset', {
  googleApiId: { // name
    type: Sequelize.INTEGER,
  },
  displayName: { // displayName
    type: Sequelize.STRING,
    allowNull: false
  },
  authorName: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  triangleCount: { // asset.formats[].formatComplexity.triangleCount
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  assetUrl: { // asset.formats[].root.url
    type: Sequelize.TEXT,
    allowNull: false
  },
  thumbnailUrl: { // thumbnail.url
    type: Sequelize.TEXT,
    allowNull: false
  }
})

module.exports = Asset
