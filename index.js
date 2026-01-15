const express = require('express')
const session = require('express-session')
const cors = require('cors')
const socialRouter = require('./routes/socialRoute')
const pool = require('./db/pool')
const passport = require('passport')
const pgSession = require('connect-pg-simple')(session)

// Load environment variables
require('dotenv').config()

//express initialization
const app = express()

//cors enabled
app.use(cors())

//access html body
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//create session table inside postgres
const sessionStore = new pgSession({
  pool: pool,
  createTableIfMissing: true
})

//setting up session and save it to cookie
app.use(session({
  secret: 'el-poco-loco',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 1000 /*1 sec*/ * 60 /*1 minute*/ * 60 /*1 hour*/ * 24 //equals 1 day    
  }
}))

app.use(passport.session())

//routes middleware
app.use('/api', socialRouter)

// Need to require the entire Passport config module so app.js knows about it
require('./lib/passport');

const PORT = 3000;

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Express app started at port ${PORT}!`);
})