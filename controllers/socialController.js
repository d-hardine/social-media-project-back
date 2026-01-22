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
const upload = multer({
  storage: storage,
  limits: {fileSize: 1048576}
})


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

const contentPost = async (req, res) => {
  const newPost = req.body.post
  await db.postContent(newPost, req.user.id)
  res.status(200).json({message: "new post created"})
}

const uploadImagePost = upload.single('image')
const uploadImagePostNext = async (req, res) => {
  const uploadToCloud = await cloudinary.uploader.upload(req.file.path) //upload to cloud
  await db.updateUserImage(req.user.id, uploadToCloud.secure_url) //update the user profile picture to database
  const updatedUser = await db.getUser(req.user.id) //retrieve the updated user info
  res.status(200).json({message: 'uploaded successfully', updatedUser})
}

module.exports = {
  signUpPost,
  loginPost,
  loginPostSuccess,
  authenticationGet,
  logoutPost,
  getAllPosts,
  contentPost,
  uploadImagePost,
  uploadImagePostNext
}