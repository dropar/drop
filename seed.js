const db = require('./server/db/db');
const {User, Asset} = require('./server/db/models');
 const users = [
  {
    name: 'john',
    email: 'hanseok87@gmail.com',
    password: '123'
  },
  {
    name: 'frank',
    email: 'andy@gmail.com',
    password: '456'
  },
  {
    name: 'josh',
    email: 'mina@gmail.com',
    password: 'abc'
  },
  {
    name: 'ryan',
    email: 'ryan@gmail.com',
    password: '123456'
  }
]
 const assets = [
  {
    displayName: 'space cat',
    thumbnailUrl: 'spacecat.png',
    assetUrl: 'spacecat.obj',
    id: 5
  },
  {
    displayName: 'earth cat',
    thumbnailUrl: 'spacecat.png',
    assetUrl: 'spacecat.obj',
    id: 2
  },
  {
    displayName: 'space dog',
    thumbnailUrl: 'spacecat.png',
    assetUrl: 'spacecat.obj',
    id: 6
  },
  {
    displayName: 'earth dog',
    thumbnailUrl: 'spacecat.png',
    assetUrl: 'spacecat.obj',
    id: 3
  },
  {
    displayName: 'space mouse',
    thumbnailUrl: 'spacecat.png',
    assetUrl: 'spacecat.obj',
    id: 1
  },
  {
    displayName: 'earth mouse',
    thumbnailUrl: 'spacecat.png',
    assetUrl: 'spacecat.obj',
    id: 8
  }
]



 const seed = () =>
  Promise.all(users.map(user => User.create(user)))
  .then(() => Promise.all(assets.map(asset => Asset.create(asset)))
  )
  .then(() => {
    return User.findById(1)
  })
  .then((user) => {
    return user.setAssets(1)
  }).catch(err => {
    console.log(err)
  })


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
