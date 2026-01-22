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

//cors setting
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your React app's URL
  credentials: true, // This allows the browser to send/receive cookies
  optionsSuccessStatus: 200,
};

//cors enabled accordance to setting
app.use(cors(corsOptions))

//access html body
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//initializing cloudinary
require('./lib/cloudinary')

//create session table inside postgres
const sessionStore = new pgSession({
  pool: pool,
  createTableIfMissing: true //if you're using prisma, please make the session table at your schema yourself
})

//setting up session and store it to postgres db
app.use(session({
  secret: 'el-poco-loco',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 1000 /*1 sec*/ * 60 /*1 minute*/ * 60 /*1 hour*/ * 24 /*1 day*/ * 7, //equals 1 week
    httpOnly: true, //for security, prevents JS access
    secure: false, //change to true in production
    sameSite: 'lax',
  }
}))

//enable passport middleware to use session
app.use(passport.initialize())
app.use(passport.session())

//routes middleware
app.use('/api', socialRouter)

// Need to require the entire Passport library module so index.js knows about it
require('./lib/passport');

const PORT = 3000;

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Express app started at port ${PORT}!`);
})