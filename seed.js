const db = require('./server/db/db');
const {User, Asset} = require('./server/db/models');

const users = [
  {
    name: 'john',
    email: 'hanseok87@gmail.com'
  },
  {
    name: 'frank',
    email: 'andy@gmail.com'
  },
  {
    name: 'josh',
    email: 'mina@gmail.com'
  },
  {
    name: 'ryan',
    email: 'ryan@gmail.com'
  }
]

const assets = [
  {
    name: 'space cat',
    thumbnail: 'spacecat.png',
    assetUrl: 'spacecat.obj'
  },
  {
    name: 'earth cat',
    thumbnail: 'spacecat.png',
    assetUrl: 'spacecat.obj'
  },
  {
    name: 'space dog',
    thumbnail: 'spacecat.png',
    assetUrl: 'spacecat.obj'
  },
  {
    name: 'earth dog',
    thumbnail: 'spacecat.png',
    assetUrl: 'spacecat.obj'
  },
  {
    name: 'space mouse',
    thumbnail: 'spacecat.png',
    assetUrl: 'spacecat.obj'
  },
  {
    name: 'earth mouse',
    thumbnail: 'spacecat.png',
    assetUrl: 'spacecat.obj'
  }
]

const seed = () =>
  Promise.all(users.map(user => User.create(user))).then(() =>
    Promise.all(assets.map(asset => Asset.create(asset)))
  )

const main = () => {
  console.log('syncing db..')
  db
    .sync({force: true})
    .then(() => {
      console.log('seeding database')
      return seed()
    })
    .then(() => {
      db.close()
      return null
    })
    .catch(err => {
      console.log('error while seeding')
      console.log(err.stack)
    })
}

main()

module.exports = main
