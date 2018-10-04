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
    const userAssets = await Asset.findAll({
      where: {userId: targetUser},
      attributes: ['thumbnail', 'name']
    })
    res.json(userAssets)
  } catch (err) {
    next(err)
  }
})

router.post('/:userId/assets', async (req, res, next) => {
  if (req.user.id == req.params.userId) {
    try {
      const user = await User.findById(parseInt(req.user.id));
      console.log("DO NOT POST TWICE!!!!!!!!!!!!!");
      const userId = user.id
      const { displayName, authorName, assetUrl, thumbnailUrl } = req.body;
      const asset = await Asset.create({
        displayName, authorName, assetUrl, thumbnailUrl, userId
      })
      const newAsset = await user.addAsset(asset);
      res.status(201).json(asset);
    }
    catch(err) {
      next(err);
    }
  }
})
