const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GitHubStrategy = require('passport-github2').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const bcrypt = require('bcryptjs')
const { prisma } = require('../lib/prisma.js') //CJS format
require('dotenv').config()

const frontUrl = process.env.FRONT_URL || 'http://localhost:3000'

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const foundUser = await prisma.user.findUnique({ where: { username: username } })

            if (!foundUser) { //check if username is not avalable in the database,
                return done(null, false, { message: "Incorrect username" }) //null means it's not an error, false means reject the auth (code 401)
            }
            const match = await bcrypt.compare(password, foundUser.password)
            if (!match) { //check if password/username couple is match
                // passwords do not match!
                return done(null, false, { message: "Incorrect password" }) //null means it's not an error, false means reject the auth (code 401)
            }
            return done(null, foundUser) //return username, could be retrieved as req.user
        } catch(err) {
            return done(err) //if everything is going wrong, return error
        }
    })
)

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${frontUrl}/api/auth/github/callback`,
    proxy: true,
},
async (accessToken, refreshToken, profile, done) => {
    const foundUser = await prisma.user.findUnique({ where: { username: profile.username } })
    if(!foundUser) {
        const hashedGithubPassword = await bcrypt.hash(Math.random().toString(), 10)
        const newUser = await prisma.user.create({
            data: {
                name: profile.displayName,
                username: profile.username,
                password: `github-oauth: ${hashedGithubPassword}`
            }
        })
        return done(null, newUser)
    } else {
        return done(null, foundUser)
    }
}))

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${frontUrl}/api/auth/google/callback`
  },
  async function(accessToken, refreshToken, profile, done) {
    const foundUser = await prisma.user.findUnique({ where: { username: [profile.name.givenName, profile.name.familyName].join('') } })
    if(!foundUser) {
        const hashedGooglePassword = await bcrypt.hash(Math.random().toString(), 10)
        const newUser = await prisma.user.create({
            data: {
                name: profile.displayName,
                username: [profile.name.givenName, profile.name.familyName].join(''),
                password: `google-oauth: ${hashedGooglePassword}`
            }
        })
        return done(null, newUser)
    } else {
        return done(null, foundUser)
    }
  }
))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (userId, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        done(null, user)
    } catch(err) {
        console.error("deserializeUser error:", err)
        done(err)
    }
})