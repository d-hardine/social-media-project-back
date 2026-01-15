const express = require('express')
const cors = require('cors')
const socialRouter = require('./routes/socialRoute')

// Load environment variables
require('dotenv').config();

//express initialization
const app = express()

//cors enabled
app.use(cors())

//access html body
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//routes middleware
app.use('/api', socialRouter)

const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`My first Express app - listening on port ${PORT}!`);
})