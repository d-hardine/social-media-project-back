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

async function getUser(userId) {
  return await prisma.user.findUnique({
    where: {id: userId}
  })
}

async function createNewUser(username, displayName, password) {
  return await prisma.user.create({
    data: {
      name: displayName,
      username: username,
      password: password
    }
  })
}

async function postContent(newPost, userId) {
  return await prisma.post.create({
    data: {
      authorId: userId,
      content: newPost
    }
  })
}

async function retrieveAllPosts() {
  return await prisma.post.findMany({
    include: {author: true},
    orderBy: {createdAt: 'desc'}
  })
}

async function updateUserImage(userId, newImageUrl) {
  return await prisma.user.update({
    where: {id: userId},
    data: {
      profilePic: newImageUrl
    }
  })
}

module.exports = { getUser, createNewUser, postContent, retrieveAllPosts, updateUserImage }