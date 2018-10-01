const User = require('./user')
const Asset = require('./asset')

//Model Associations
Asset.belongsTo(User);
User.hasMany(Asset);

module.exports = {
  User,
  Asset
}
