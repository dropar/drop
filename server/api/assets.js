const router = require('express').Router()
const Asset = require('../db/models/asset')
module.exports = router



router.get('/', async (req, res, next) => {
  try {
    const asset = await Asset.findAll();
    res.json(asset);
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.get('/:assetId', async (req, res, next) => {
  console.log(Asset)
  try {
    const asset = await Asset.findById(req.params.assetId)
    res.json(asset)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.post('/addToUser', async (req, res, next)=>{
  const targetUser = req.user.id;
  const payload = req.body.id;
  try {
    const userLookup = User.findById(targetUser);
    userLookup.setAssets(payload);
    res.status(201).end();
  } catch(err) {
    console.error(err);
    next(err);
  }
})

router.put('/removeFromUser', async (req, res, next)=>{
  const targetUser = req.user.id;
  const payload = req.body.id;
  try {
    const userLookup = User.findById(targetUser);
    userLookup.removeAssets(payload);
    res.status(202).end();
  } catch(err) {
    console.error(err);
    next(err);
  }
})

router.get('/:category', async (req, res, next) => {
  const category = req.params.category;
  try {
    const assets = await Asset.findAll({where: {category: category}})
    console.log(assets);
    res.send(assets)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.post('/', async(req,res,next) => {
  try {
    await Asset.create({
      displayName: req.body.displayName,
      authorName: req.body.authorName,
      thumbnailUrl: req.body.thumbnailUrl,
      googleApiId: req.body.googleApiId,
      assetUrl: req.body.assetUrl,
      category: req.body.category
    })
    console.log(`this error lives in the assets post route`)
    res.status(201).json('Assets have posted')
  } catch (error) {
    next(error)
  }
})
