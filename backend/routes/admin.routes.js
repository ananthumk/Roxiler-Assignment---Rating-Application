const express = require('express')
const { addUser, dashboard, getStores, addStore, getUsers, getUser } = require('../controllers/admin.controller')
const { authorize, authenticate } = require('../middleware/auth.middleware')
const adminRouter = express.Router()

adminRouter.post('/users', authenticate, authorize(['admin']), addUser)
adminRouter.get('/dashboard',authenticate, authorize(['admin']), dashboard)
adminRouter.get('/stores',authenticate, authorize(['admin']), getStores)
adminRouter.post('/stores',authenticate, authorize(['admin']), addStore)
adminRouter.get('/users',authenticate, authorize(['admin']), getUsers)
adminRouter.get('/users/:id',authenticate, authorize(['admin']), getUser)

module.exports = adminRouter