const { Router } = require('express')
const socialController = require('../controllers/socialController')

const socialRouter = Router()

socialRouter.get('/auth', socialController.authenticationGet)
socialRouter.post('/signup', socialController.validateSignUp, socialController.signUpPost)
socialRouter.post('/login', socialController.loginPost, socialController.loginPostSuccess)

socialRouter.get('/auth/github', socialController.loginGithub)
socialRouter.get('/auth/github/callback', socialController.loginGithubCallback, socialController.loginGithubSuccess)

socialRouter.get('/auth/google', socialController.loginGoogle)
socialRouter.get('/auth/google/callback', socialController.loginGoogleCallback, socialController.loginGoogleSuccess)

socialRouter.post('/logout', socialController.logoutPost)

socialRouter.get('/all-posts', socialController.getAllPosts)
socialRouter.get('/following-posts/', socialController.getFollowingPosts)
socialRouter.get('/account-posts/:accountId', socialController.getAccountPosts)
socialRouter.get('/single-post/:statusId', socialController.getSinglePost)
socialRouter.get('/comments/:statusId', socialController.getComments)
socialRouter.post('/create-comment', socialController.commentPost)
socialRouter.post('/create-post', socialController.uploadImage, socialController.contentPost)

socialRouter.get('/like/:statusId', socialController.retrieveLike)
socialRouter.post('/like/:statusId', socialController.addLike)
socialRouter.delete('/like/:statusId', socialController.deleteLike)

socialRouter.get('/account/:accountId', socialController.getAccount)

socialRouter.get('/follow/:accountId', socialController.retrieveFollow)
socialRouter.post('/follow/:accountId', socialController.addFollow)
socialRouter.delete('/follow/:accountId', socialController.deleteFollow)

socialRouter.get('/latest-users', socialController.getAllLatestUsers)

socialRouter.put('/upload-image', socialController.uploadImage, socialController.uploadImagePutNext, socialController.uploadImagePutError)
socialRouter.put('/update-bio', socialController.updateBioPut)
socialRouter.put('/update-website', socialController.updateWebsitePut)
socialRouter.put('/update-display-name', socialController.updateDisplayedNamePut)

socialRouter.get('/conversations/:userId', socialController.getConversations)
socialRouter.get('/messages/:conversationId', socialController.getMessages)
socialRouter.get('/conversation-members/:conversationId', socialController.getConversationMembers)
socialRouter.post('/chat', socialController.chat)

module.exports = socialRouter