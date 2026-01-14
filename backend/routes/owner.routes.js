const express = require('express')
const { dashboard, recentReviews } = require('../controllers/owner.controller')
const { authenticate, authorize } = require('../middleware/auth.middleware')
const ownerRouter = express.Router()

ownerRouter.get('/dashboard', authenticate, authorize(['owner']), dashboard )
ownerRouter.get('/reviews', authenticate, authorize(['owner']), recentReviews )

module.exports = ownerRouter