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
    id: 1,
    name: 'lemon',
    price: 44,
    description: 'lemon pills'
  },
  {
    id: 2,
    name: 'apple',
    price: 3,
    description: 'apple pills'
  },
  {
    id: 3,
    name: 'yams',
    price: 55,
    description: 'yams pills'
  },
  {
    id: 4,
    name: 'potato',
    price: 76,
    description: 'potato pills'
  },
  {
    id: 5,
    name: 'orange',
    price: 32,
    description: 'orange pills'
  },
  {
    id: 6,
    name: 'dog food',
    price: 56,
    description: 'dog food'
  }
]

const seed = () =>
  Promise.all(users.map(user => User.create(user))).then(() =>
    Promise.all(products.map(product => Product.create(product)))
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
