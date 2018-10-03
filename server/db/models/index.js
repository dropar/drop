const User = require('./user')
const Asset = require('./asset')

//Model Associations
Asset.belongsToMany(User, {through: 'ownership'});
User.belongsToMany(Asset, {through: 'ownership'});

module.exports = {
  User,
  Asset
}
