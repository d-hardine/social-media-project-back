const { Router } = require('express')
const socialController = require('../controllers/socialController')
const passport = require('passport')

const socialRouter = Router()

socialRouter.get('/auth', socialController.authenticationGet)
socialRouter.post('/signup', socialController.signUpPost)
socialRouter.post('/login', socialController.loginPost, socialController.loginPostSuccess)

module.exports = socialRouter