const router = require('express').Router()
module.exports = router

router.get('/', (req,res,next) => {
  try {
    res.json('helloooooooooo')
  } catch(error) {
    next(error)
  }
})

router.use('/users', require('./users'))
router.use('/assets', require('./assets'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
