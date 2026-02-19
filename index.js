const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const session = require('express-session')
const cors = require('cors')
const socialRouter = require('./routes/socialRoute')
const pool = require('./db/pool')
const passport = require('passport')
const pgSession = require('connect-pg-simple')(session)
const db = require('./db/queries')

// Load environment variables
require('dotenv').config()

// frontend url/the react app url
const frontUrl = process.env.FRONT_URL || 'http://localhost:5173'
// backend url
const backUrl = process.env.BACK_URL || 'http://localhost:3000'
const DEV_MODE = process.env.DEV_MODE

//express and socket.io initialization
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: frontUrl,
  methods: ['GET', 'POST'],
})

//cors setting
const corsOptions = {
  origin: frontUrl, // Replace with your React app's URL
  credentials: true, // This allows the browser to send/receive cookies
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

//cors enabled accordance to setting
app.use(cors(corsOptions))

//access html body
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set('trust proxy', 1); // Allows Express trusts header from proxy, or in this case, my frontend

//initializing cloudinary
require('./lib/cloudinary')

//create session table inside postgres
const sessionStore = new pgSession({
  pool: pool,
  createTableIfMissing: true //if you're using prisma, please make the session table at your schema yourself
})

//setting up session and store it to postgres db
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  proxy: true,
  cookie: {
    maxAge: 1000 /*1 sec*/ * 60 /*1 minute*/ * 60 /*1 hour*/ * 24 /*1 day*/ * 7, //equals 1 week
    httpOnly: true, //for security, prevents JS access
    secure: DEV_MODE ? false : true,
    sameSite: 'lax',
  }
}))

//enable passport middleware to use session
app.use(passport.initialize())
app.use(passport.session())

//home directory initialization
app.get('/', (req, res) => {
  res.status(200).send('OK')
})

//routes middleware
app.use('/api', socialRouter)

// Need to require the entire Passport library module so index.js knows about it
require('./lib/passport');

//socket stuff
io.on('connection', (socket) => {
  console.log(socket.id + " connected")

  // Client calls this as soon as they open the chat UI
  socket.on('join_chat', (conversationId) => {
    socket.join(conversationId)
  })

  socket.on('send_message', async (data, callback) => {
    const { conversationId, senderId, content } = data

    try {
      await db.newMessage(conversationId, senderId, content) // Save the new message to Postgres via Prisma
      const newMessages = await db.retrieveMessages(conversationId) // Fetch updated messages
      await db.updateLastMessageConversation(conversationId, content) // Update the last Message in the Conversation

      callback(newMessages)

      io.to(conversationId).emit('new_message', { newMessages }) //Broadcast to everyone in the room
    } catch (err) {
      console.error("Message save error:", err)
    }
  })

  socket.on('disconnect', () => {
    console.log(socket.id + ' disconnected')
  })
})

const PORT = 3000;

server.listen(PORT, DEV_MODE ? "127.0.0.1" : '0.0.0.0', (error) => {
  if (error) {
    throw error;
  }
  console.log(`Express and socket io app started at port ${PORT}!`);
})