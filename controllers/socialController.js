const bcrypt = require('bcryptjs')
const db = require('../db/queries')
const passport = require('passport')

const signUpPost = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  await db.createNewUser(req.body.username, req.body.displayName, hashedPassword)
  res.status(201).json({message: "inputted data for sign up OK"})
}

const loginPost = passport.authenticate('local', {failureRedirect: '/', failureMessage: true}) //handled by passport library

module.exports = { signUpPost, loginPost}