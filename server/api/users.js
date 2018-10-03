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
      const user = await User.findById(req.params.id)
      const { googleApiId, displayName, authorName, assetUrl, triangleCount, thumbnailUrl } = req.body;
      const newAsset = await user.addAsset({
        googleApiId, displayName, authorName, assetUrl, triangleCount, thumbnailUrl
      });
      res.status(201).json(newAsset);
    }
    catch(err) {
      next(err);
    }
  }
})
