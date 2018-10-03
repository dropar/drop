const User = require('./user')
const Asset = require('./asset')
const db = require('../db.js');

//Model Associations
Asset.belongsTo(User);
User.hasMany(Asset);


module.exports = {
  User,
  Asset
}
