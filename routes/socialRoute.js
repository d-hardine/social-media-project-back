const { Router } = require('express')
const socialController = require('../controllers/socialController')

const socialRouter = Router()

socialRouter.get('/auth', socialController.authenticationGet)
socialRouter.post('/signup', socialController.signUpPost)
socialRouter.post('/login', socialController.loginPost, socialController.loginPostSuccess)
socialRouter.post('/logout', socialController.logoutPost)

socialRouter.get('/all-posts', socialController.getAllPosts)
socialRouter.post('/post', socialController.contentPost)

socialRouter.post('/upload-image', socialController.uploadImagePost, socialController.uploadImagePostNext)

module.exports = socialRouter