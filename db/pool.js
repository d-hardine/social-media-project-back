require('dotenv').config()
const { Pool } = require("pg")

const connectionString = `${process.env.DATABASE_URL}`

// Again, this should be read from an environment variable
module.exports = new Pool({
  connectionString: connectionString
});