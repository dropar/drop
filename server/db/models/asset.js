const Sequelize = require('sequelize')
const db = require('../db')

const Asset = db.define('asset', {
<<<<<<< Updated upstream
  googleApiId: { // name
    type: Sequelize.STRING,
  },
=======
>>>>>>> Stashed changes
  displayName: { // displayName
    type: Sequelize.STRING,
    allowNull: false
  },
  authorName: {
    type: Sequelize.STRING,
    allowNull: true
  },
  assetUrl: { // asset.formats[].root.url
    type: Sequelize.TEXT,
    allowNull: false
  },
  thumbnailUrl: { // thumbnail.url
    type: Sequelize.TEXT,
    allowNull: false
  },
<<<<<<< Updated upstream
  category: {
    type: Sequelize.ENUM('Architecture', 'Art', 'Food', 'Nature', 'Objects', 'People', 'Scenes', 'Technology','Transport', 'Other'),
    allowNull: false
=======
  googleApiId: { // name
    type: Sequelize.INTEGER,
    allowNull: true
  },
  triangleCount: { // asset.formats[].formatComplexity.triangleCount
    type: Sequelize.INTEGER,
    allowNull: true,
>>>>>>> Stashed changes
  }
})

module.exports = Asset
