const router = require('express').Router()
const Asset = require('../db/models/asset')
module.exports = router

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
