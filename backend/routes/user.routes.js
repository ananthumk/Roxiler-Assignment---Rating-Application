const express = require('express')
const { getStores, addRating, updateRating } = require('../controllers/user.controller')
const { authenticate, authorize } = require('../middleware/auth.middleware')
const { validateAddRating, validateUpdateRating } = require('../middleware/validate.middleware')
const userRouter = express.Router()

userRouter.get('/stores', authenticate, authorize(['user']), getStores)
userRouter.post('/ratings', authenticate, authorize(['user']), validateAddRating, addRating)
userRouter.patch('/ratings/:storeId', authenticate, authorize(['user']), validateUpdateRating, updateRating)

module.exports = userRouter;