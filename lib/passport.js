const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { prisma } = require('../lib/prisma.js') //CJS format

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const foundUser = await prisma.user.findUnique({
                where: {
                    username: username
                }
            })

            if (!foundUser) { //check if username is even avalable in the database,
                return done(null, false, { message: "Incorrect username" }) //null means it's not an error, false means reject the auth (code 401)
            }
            const match = await bcrypt.compare(password, foundUser.password)
            if (!match) { //check if password/username couple is match
                // passwords do not match!
                return done(null, false, { message: "Incorrect password" }) //null means it's not an error, false means reject the auth (code 401)
            }
            return done(null, foundUser); //return username, could be retrieved as req.user
        } catch(err) {
            return done(err) //if everything is going wrong, return error
        }
    })
)

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
    done(err)
  }
})