const router = require('express').Router()
const {User} = require('../db/models')
const {Asset} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/:userId/assets', async (req, res, next) => {
  const targetUser = req.params.userId;
  try {
    const user = await User.findById(targetUser);
    const userAssets = await user.getAssets();
    console.log(userAssets)
    res.json(userAssets)
  } catch (err) {
    next(err)
  }
})
