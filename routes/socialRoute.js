const { Router } = require('express')
const socialController = require('../controllers/socialController')

const socialRouter = Router()

socialRouter.get('/auth', socialController.authenticationGet)
socialRouter.post('/signup', socialController.signUpPost)
socialRouter.post('/login', socialController.loginPost, socialController.loginPostSuccess)
socialRouter.post('/logout', socialController.logoutPost)

socialRouter.get('/all-posts', socialController.getAllPosts)
socialRouter.get('/single-post/:statusId', socialController.getSinglePost)
socialRouter.get('/comments/:statusId', socialController.getComments)
socialRouter.post('/create-comment', socialController.commentPost)
socialRouter.post('/create-post', socialController.contentPost)

socialRouter.put('/upload-image', socialController.uploadImagePut, socialController.uploadImagePutNext, socialController.uploadImagePutError)
socialRouter.put('/update-bio', socialController.updateBioPut)
socialRouter.put('/update-website', socialController.updateWebsitePut)

module.exports = socialRouter