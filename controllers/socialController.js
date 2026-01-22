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
const upload = multer({ storage: storage })


const signUpPost = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  await db.createNewUser(req.body.username, req.body.displayName, hashedPassword)
  res.status(201).json({message: "inputted data for sign up OK"})
}

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

const uploadImagePost = upload.single('file')
const uploadImagePostNext = async (req, res) => {
  console.log(req)
  const uploadToCloud = await cloudinary.uploader.upload(req.file.path)
  console.log(uploadToCloud)
  res.send('uploaded successfully')
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