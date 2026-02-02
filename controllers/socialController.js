const bcrypt = require('bcryptjs')
const db = require('../db/queries')
const passport = require('passport')
const cloudinary = require('cloudinary').v2

//multer setup
const path = require('node:path')
const multer  = require('multer')
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        let fn = file.originalname + ' - ' + Date.now() + path.extname(file.originalname)
        cb(null, fn)
    }
})
const fileFilter = (req, file, cb) => { //filter that only image file that can be uploaded
  // Check file types (mimetype) and extensions
  const allowedTypes = /jpeg|jpg|png/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true); // Accept file
  }
  
  // Reject file and pass an error message
  cb(new Error('Only image files (JPEG, JPG, PNG) are allowed!'), false); 
};
const upload = multer({
  storage: storage,
  limits: {fileSize: 1048576}, // 1 MB
  fileFilter: fileFilter
})

//use this multer upload middleware to upload stuff
const uploadImage = upload.single('image')


const signUpPost = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  await db.createNewUser(req.body.username, req.body.displayName, hashedPassword)
  res.status(201).json({message: "inputted data for sign up OK"})
}

//login middlewares
const loginPost = passport.authenticate('local', {failureRedirect: '/', failureMessage: true}) //handled by passport library
const loginPostSuccess = (req, res) => {
  res.status(201).json(req.user)
}

const authenticationGet = async (req, res) => {
  if(req.isAuthenticated()) {
    res.status(201).json(req.user)
  } else {
    res.status(401).json({message: 'user is not authenticated jancok i'})
  }
}

const logoutPost = (req, res, next) => {
  // Passport provides req.logout() to end a login session
  req.logout((err) => {
    if (err) {
      return next(err); // Handle errors
    }
    // Destroy the session completely if using express-session
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      // Send a response to the client
      res.status(200).send('Logged out successfully');
    });
  });
}

const getAllPosts = async (req, res) => {
  const allPosts = await db.retrieveAllPosts()
  res.status(200).json({message: "All posts retrieved", allPosts})
}

const getFollowingPosts = async (req, res) => {
  const retrievedFollowing = await db.retrieveFollowing(req.user.id)
  let retrievedFollowingArray = []
  for(let i = 0; i < retrievedFollowing.length; i++) {
    retrievedFollowingArray[i] = retrievedFollowing[i].followedById
  }
  const followingPosts = await db.retrieveFollowingPosts(retrievedFollowingArray)
  res.status(200).json({message: "Following posts retrieved", followingPosts})
}

const getAccountPosts = async (req, res) => {
  const accountPosts = await db.retrieveAccountPosts(req.params.accountId)
  res.status(200).json({message: "Account posts retrieved", accountPosts})
}

const getSinglePost = async (req, res) => {
  const singlePost = await db.retrieveSinglePost(req.params.statusId)
  res.status(200).json({message: "single post retrieved", singlePost})
}

const getComments =  async (req, res) => {
  const comments = await db.retrieveComments(req.params.statusId)
  res.status(200).json({message: "comments retrieved", comments})
}

const commentPost = async (req, res) => {
  const { newComment, postId } = req.body
  await db.postComment(newComment, postId, req.user.id)
  res.send('comment added')
}

const contentPost = async (req, res, next) => {
  const { newPost } = req.body
  if(req.file) { //if user uploading a file
    const uploadToCloud = await cloudinary.uploader.upload(req.file.path) //upload to cloud
    await db.postContent(newPost, req.user.id, uploadToCloud.secure_url)
  } else {
   await db.postContent(newPost, req.user.id)
  }
  //res.status(201).json({message: "new post created"})
  res.status(201).json({message: "new post created"})
}

//whole profile picture upload middleware
const uploadImagePutNext = async (req, res, next) => {
  const uploadToCloud = await cloudinary.uploader.upload(req.file.path) //upload to cloud
  await db.updateUserImage(req.user.id, uploadToCloud.secure_url) //update the user profile picture to database
  const updatedUser = await db.getUser(req.user.id) //retrieve the updated user info
  res.status(200).json({message: 'uploaded successfully', updatedUser})
  next()
}
const uploadImagePutError = (error, req, res, next) => {
// Handle Multer errors (e.g., file type error, file size error)
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ message: `Multer error: ${error.message}` });
  } else if (error) {
    // Handle custom errors from fileFilter
    return res.status(400).json({ message: error.message });
  }
  next();
}

const updateBioPut = async (req, res) => {
  const { newBio } = req.body
  await db.updateUserBio(req.user.id, newBio)
  const updatedUser = await db.getUser(req.user.id) //retrieve the updated user info
  res.status(200).json({message: 'uploaded successfully', updatedUser})
}

const updateWebsitePut = async (req, res) => {
  const { newWebsite } = req.body
  await db.updateUserWebsite(req.user.id, newWebsite)
  const updatedUser = await db.getUser(req.user.id) //retrieve the updated user info
  res.status(200).json({message: 'uploaded successfully', updatedUser})
}

const retrieveLike = async (req, res) => {
  const retrievedLike = await db.retrieveLike(req.params.statusId)
  res.status(200).json({message: 'like data retrieved', retrievedLike})
}

const addLike = async (req, res) => {
  await db.addLike(req.params.statusId, req.user.id)
  res.send('like added')
}

const deleteLike = async (req, res) => {
  await db.deleteLike(req.params.statusId, req.user.id)
  res.send('like deleted successfully')
}

const getAccount = async (req, res) => {
  const retrievedAccount = await db.getAccount(req.params.accountId)
  res.status(200).json({message: 'account data retrieved', retrievedAccount})
}

const retrieveFollow = async (req, res) => {
  const retrievedFollowers = await db.retrieveFollowers(req.params.accountId)
  const retrievedFollowing = await db.retrieveFollowing(req.params.accountId)
  res.status(200).json({message: 'follow data retrieved', retrievedFollowers, retrievedFollowing})
}

const addFollow = async (req, res) => {
  await db.addFollow(req.user.id, req.params.accountId)
  res.send('follow added')
}

const deleteFollow = async (req, res) => {
  await db.deleteFollow(req.user.id, req.params.accountId)
  res.send('follow deleted')
}

const getAllLatestUsers =  async (req, res) => {
  const latestUsers = await db.getAllLatestUsers(req.user.id)
  res.status(200).json({message: 'like data retrieved', latestUsers})
}

module.exports = {
  signUpPost,
  loginPost,
  loginPostSuccess,
  authenticationGet,
  logoutPost,
  getAllPosts,
  getFollowingPosts,
  getAccountPosts,
  getSinglePost,
  getComments,
  commentPost,
  contentPost,
  uploadImage,
  uploadImagePutNext,
  uploadImagePutError,
  updateBioPut,
  updateWebsitePut,
  retrieveLike,
  addLike,
  deleteLike,
  getAccount,
  retrieveFollow,
  addFollow,
  deleteFollow,
  getAllLatestUsers,
}