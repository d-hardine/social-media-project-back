//import { prisma } from '../lib/prisma.js' //ESM format
const { prisma } = require('../lib/prisma.js') //CJS format

/*
findUsername()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
*/

async function createNewUser(username, displayName, password) {
  const user = await prisma.user.create({
    data: {
      name: displayName,
      username: username,
      password: password
    }
  })
  console.log(user)
}

module.exports = { createNewUser }