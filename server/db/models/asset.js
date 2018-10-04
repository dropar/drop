const Sequelize = require('sequelize')
const db = require('../db')

const Asset = db.define('asset', {
  googleApiId: { // name
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
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
  },
  category: {
    type: Sequelize.ENUM('Architecture', 'Art', 'Food', 'Nature', 'Objects', 'People', 'Scenes', 'Technology','Transport', 'Other', 'N/A'),
    allowNull: false
  }
})

module.exports = Asset
