const router = require('express').Router()
<<<<<<< HEAD
const Asset = require('../db/models/asset')
module.exports = router

// get asset by id
router.get('/:assetId', async (req, res, next) => {
  console.log(Asset)
  try {
    const asset = await Asset.findById(req.params.assetId)
    res.json(asset)
  } catch (err) {
    console.error(err)
=======
const { Asset } = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    // const allProducts = await Product.findAll({
    //   // explicitly select only the id and email fields - even though
    //   // users' passwords are encrypted, it won't help if we just
    //   // send everything to anyone who asks!
    //   attributes: ['name', 'assetUrl']
    // })
    res.json("ROUTE IS WORKINGGGGGGGGGGGGGGGGGGGGGGG");
  } catch (err) {
>>>>>>> 617b7e696a9d48ea3d29e4c183da5fd612210489
    next(err)
  }
})
