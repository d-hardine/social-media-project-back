const { Router } = require('express')
const socialController = require('../controllers/socialController')

const socialRouter = Router()

socialRouter.post('/signup', socialController.signUpPost)

module.exports = socialRouter