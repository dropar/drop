const router = require('express').Router()
const {User} = require('../db/models')
const {Asset} = require('../db/models/asset')
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

router.get('/:id/assets', async (req, res, next) => {
  const targetUser = req.user.id;
  try {
    const userAssets = await Asset.findAll({
      where: {userId: targetUser}
    })
    res.json(userAssets)
  } catch (err) {
    next(err)
  }
})
