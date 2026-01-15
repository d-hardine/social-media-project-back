const { Router } = require('express')
const socialController = require('../controllers/socialController')
const passport = require('passport')

const socialRouter = Router()

socialRouter.post('/signup', socialController.signUpPost)
socialRouter.post('/login', socialController.loginPost, (req, res) => {res.status(201).json({message: "inputted data for sign up OK"});})

module.exports = socialRouter