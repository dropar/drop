const router = require('express').Router()
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
    next(err)
  }
})
