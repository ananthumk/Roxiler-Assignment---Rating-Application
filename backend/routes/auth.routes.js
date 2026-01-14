const express = require('express')
const { signup, login, updatePassword } = require('../controllers/auth.controller')
const { authenticate } = require('../middleware/auth.middleware')
const authRouter = express.Router()

authRouter.post('/signup', signup)
authRouter.post('/login', login)
authRouter.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
})
authRouter.patch('/update-password', authenticate, updatePassword)

module.exports = authRouter