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
  // {
  //   displayName: 'space cat',
  //   thumbnailUrl: 'spacecat.png',
  //   assetUrl: 'spacecat.obj',
  //   id: 5
  // },
  // {
  //   displayName: 'earth cat',
  //   thumbnailUrl: 'http://www3.pictures.zimbio.com/gi/The+Jinx+New+York+Premire+l37VdCmDEUGl.jpg',
  //   assetUrl: 'spacecat.obj',
  //   id: 2
  // },
  // {
  //   displayName: 'space dog',
  //   thumbnailUrl: 'spacecat.png',
  //   assetUrl: 'spacecat.obj',
  //   id: 6
  // },
  // {
  //   displayName: 'earth dog',
  //   thumbnailUrl: 'spacecat.png',
  //   assetUrl: 'spacecat.obj',
  //   id: 3
  // },
  // {
  //   displayName: 'space mouse',
  //   thumbnailUrl: 'http://www3.pictures.zimbio.com/gi/The+Jinx+New+York+Premire+l37VdCmDEUGl.jpg',
  //   assetUrl: 'spacecat.obj',
  //   id: 1
  // },
  // {
  //   displayName: 'earth mouse',
  //   thumbnailUrl: 'spacecat.png',
  //   assetUrl: 'spacecat.obj',
  //   id: 8
  // },
  {
    googleApiId: '5OP5JSQZZn-',
    displayName: 'Galactic Cat',
    authorName: '3Donimus',
    triangleCount: 817584,
    assetUrl: 'https://poly.googleapis.com/downloads/5OP5JSQZZn-/bH019e0GhVf/tmp1435adba.gltf',
    thumbnailUrl: 'https://lh3.googleusercontent.com/gVNS2NSKIHwtmOuA29F4dZjHsvmxAzLL9bqXInKx1GemsUopXY8NT37nkC3FnlEP',
    category: 'Architecture',
  },
  {
    googleApiId: '6kCzvvxTOej',
    displayName: 'Van Goghs The wheatfield',
    authorName: 'Tekano Bob',
    triangleCount: 378856,
    assetUrl: "https://poly.googleapis.com/downloads/6kCzvvxTOej/0ItsFgHRVS-/tmp2388f4d8.gltf",
    thumbnailUrl: "https://lh3.googleusercontent.com/PtNvfeGKuoa0t7zagntX_SJotkR_NrwL-6ZKqluknrfMzN1Hv7QEIz8GpPu90lw",
    category: 'Art',
  },

]



 const seed = () =>
  Promise.all(users.map(user => User.create(user)))
  .then(() => Promise.all(assets.map(asset => Asset.create(asset)))
  )
  .then(() => {
    return User.findById(4)
  })
  .then((user) => {
    return user.setAssets([1,2])
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
